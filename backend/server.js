const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;
const saltRounds = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'healthcare_fallback_secret_key';

// Middleware
app.use(cors());
app.use(express.json());

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
    console.log(`[Auth Log] Incoming headers for ${req.method} ${req.originalUrl}:`, req.headers);
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer <token>
    if (!token) {
        console.warn(`[Auth Warning] Access token is missing for ${req.method} ${req.originalUrl}`);
        return res.status(401).json({ success: false, message: 'Access token is required.' });
    }
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error(`[Auth Error] Invalid or expired token for ${req.method} ${req.originalUrl}:`, err.message);
            return res.status(403).json({ success: false, message: 'Invalid or expired token.' });
        }
        req.user = decoded;
        next();
    });
};

// Database Connection Pool
const hasSupabaseUrl = process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('[YOUR-PASSWORD]');

const poolConfig = hasSupabaseUrl
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
      }
    : {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || 'healthcare_db',
        port: process.env.DB_PORT || 5432,
        ssl: (process.env.DB_HOST === 'localhost' || process.env.DB_HOST === 'host.docker.internal') ? false : { rejectUnauthorized: false }
      };

const pool = new Pool(poolConfig);

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
});

// --- API Endpoints ---

// ... (GET '/' is unchanged) ...
app.get('/', (req, res) => { res.send('Health Care System API is running!'); });

// --- SECURED AUTHENTICATION ---
// ** UPDATED: Cleaned Login Endpoint (No Debug Logs) **
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password are required.' });
    }
    try {
        // 1. Find the user by username only
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (result.rows.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const user = result.rows[0];

        // 2. Compare the provided password with the stored hash
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            // 3. Passwords match, login is successful
            delete user.password;
            const token = jwt.sign(
                { id: user.id, username: user.username, role: user.role, name: user.name },
                JWT_SECRET,
                { expiresIn: '7d' }
            );
            res.json({ success: true, token, user });
        } else {
            // 4. Passwords do not match
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Database error during login.' });
    }
});

// ** UPDATED: Secure User Creation Endpoint **
app.post('/api/users', async (req, res) => {
    const { username, password, role, name } = req.body;
    try {
        // 1. Hash the plain-text password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 2. Store the hashed password in the database
        const result = await pool.query(
            'INSERT INTO users (username, password, role, name) VALUES ($1, $2, $3, $4) RETURNING id, username, role, name',
            [username, hashedPassword, role, name]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        // Handle cases where the username might already exist
        if (error.code === '23505') {
            return res.status(409).json({ message: 'Username already exists.' });
        }
        res.status(500).json({ message: 'Failed to create user', error });
    }
});


// ... (All other endpoints for Patients, Appointments, Medical Records - PostgreSQL version) ...
app.get('/api/users', authenticateToken, async (req, res) => { try { const result = await pool.query('SELECT id, username, role, name FROM users'); res.json(result.rows); } catch (error) { res.status(500).json({ message: 'Failed to fetch users', error }); } });

app.get('/api/patients', authenticateToken, async (req, res) => { try { const result = await pool.query('SELECT * FROM patients ORDER BY id'); res.json(result.rows); } catch (error) { res.status(500).json({ message: 'Failed to fetch patients', error }); } });

app.post('/api/patients', authenticateToken, async (req, res) => { const { name, dob, gender, contact, email, address } = req.body; try { const result = await pool.query('INSERT INTO patients (name, dob, gender, contact, email, address) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [name, dob, gender, contact, email, address]); res.status(201).json(result.rows[0]); } catch (error) { res.status(500).json({ message: 'Failed to add patient', error }); } });

app.put('/api/patients/:id', authenticateToken, async (req, res) => { const { id } = req.params; const { name, dob, gender, contact, email, address } = req.body; try { const result = await pool.query('UPDATE patients SET name = $1, dob = $2, gender = $3, contact = $4, email = $5, address = $6 WHERE id = $7 RETURNING *', [name, dob, gender, contact, email, address, id]); if (result.rows.length === 0) { return res.status(404).json({ message: 'Patient not found' }); } res.json(result.rows[0]); } catch (error) { res.status(500).json({ message: 'Failed to update patient', error }); } });

app.delete('/api/patients/:id', authenticateToken, async (req, res) => { const { id } = req.params; try { await pool.query('DELETE FROM medical_records WHERE patient_id = $1', [id]); await pool.query('DELETE FROM appointments WHERE patient_id = $1', [id]); const result = await pool.query('DELETE FROM patients WHERE id = $1', [id]); if (result.rowCount === 0) { return res.status(404).json({ message: 'Patient not found' }); } res.status(200).json({ success: true, message: 'Patient deleted successfully' }); } catch (error) { res.status(500).json({ message: 'Failed to delete patient', error }); } });

app.get('/api/appointments', authenticateToken, async (req, res) => { try { const result = await pool.query('SELECT id, patient_id AS "patientId", patient_name AS "patientName", doctor_name AS "doctorName", date, reason, status, created_at AS "createdAt" FROM appointments ORDER BY date DESC'); res.json(result.rows); } catch (error) { res.status(500).json({ message: 'Failed to fetch appointments', error }); } });

app.post('/api/appointments', authenticateToken, async (req, res) => { const { patientId, patientName, doctorName, date, reason } = req.body; try { const result = await pool.query('INSERT INTO appointments (patient_id, patient_name, doctor_name, date, reason, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, patient_id AS "patientId", patient_name AS "patientName", doctor_name AS "doctorName", date, reason, status, created_at AS "createdAt"', [patientId, patientName, doctorName, date, reason, 'Scheduled']); res.status(201).json(result.rows[0]); } catch (error) { res.status(500).json({ message: 'Failed to schedule appointment', error }); } });

app.get('/api/medical-records', authenticateToken, async (req, res) => { try { const result = await pool.query('SELECT id, patient_id AS "patientId", doctor_name AS "doctorName", date, diagnosis, prescription, notes, created_at AS "createdAt" FROM medical_records'); res.json(result.rows); } catch (error) { res.status(500).json({ message: 'Failed to fetch medical records', error }); } });

app.post('/api/medical-records', authenticateToken, async (req, res) => { const { patientId, doctorName, date, diagnosis, prescription, notes } = req.body; try { const result = await pool.query('INSERT INTO medical_records (patient_id, doctor_name, date, diagnosis, prescription, notes) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, patient_id AS "patientId", doctor_name AS "doctorName", date, diagnosis, prescription, notes, created_at AS "createdAt"', [patientId, doctorName, date, diagnosis, prescription, notes]); res.status(201).json(result.rows[0]); } catch (error) { res.status(500).json({ message: 'Failed to add medical record', error }); } });


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    if (hasSupabaseUrl) {
        // Mask password in logs
        const maskedUrl = process.env.DATABASE_URL.replace(/:([^:@]+)@/, ':******@');
        console.log(`Database: Connected to Supabase via connection string`);
        console.log(`Database URL: ${maskedUrl}`);
    } else {
        console.log(`Database: Local PostgreSQL - ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'healthcare_db'}`);
    }
});