// src/services/sheetsService.js
import axios from 'axios';

// 🔴 Replace with your own SheetDB URL
const SHEETDB_URL = 'https://sheetdb.io/api/v1/beegcoem0pi5n';

export async function submitInternshipData(formData) {
    try {
        const payload = { data: [formData] };
        const response = await axios.post(SHEETDB_URL, payload);
        return response.data;
    } catch (error) {
        console.error('Error sending data to Google Sheet:', error);
        throw error;
    }
}

export async function getAllInternships() {
    try {
        const response = await axios.get(SHEETDB_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching data from Google Sheet:', error);
        return [];
    }
}

export async function getStudentBySAP(sap_id) {
    try {
        const response = await axios.get(`${SHEETDB_URL}/search?sap_id=${sap_id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching student data:', error);
        return [];
    }
}
