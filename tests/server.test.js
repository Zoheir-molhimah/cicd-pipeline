const request = require('supertest');
const app = require('../src/server');

describe('CICD Pipeline App Server', () => {
  describe('GET /', () => {
    it('should serve the main HTML page', async () => {
      const response = await request(app).get('/').expect(200);

      // Should serve HTML content
      expect(response.text).toContain('<!doctype html>');
      expect(response.headers['content-type']).toMatch(/text\/html/);
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health').expect(200);

      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('environment');
    });
  });

  describe('GET /api/status', () => {
    it('should return API status', async () => {
      const response = await request(app).get('/api/status').expect(200);

      expect(response.body).toHaveProperty('message', 'API is running');
      expect(response.body).toHaveProperty('version', '1.0.0');
      expect(response.body).toHaveProperty('environment');
    });
  });

  describe('404 handler', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app).get('/unknown-route').expect(404);

      expect(response.body).toHaveProperty('error', 'Route not found');
      expect(response.body).toHaveProperty('path', '/unknown-route');
    });
  });
});
