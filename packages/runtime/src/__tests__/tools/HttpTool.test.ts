import { HttpTool } from '../../tools/HttpTool';
import axios from 'axios';

jest.mock('axios');

describe('HttpTool', () => {
  let tool: HttpTool;

  beforeEach(() => {
    tool = new HttpTool();
    jest.clearAllMocks();
  });

  describe('GET requests', () => {
    it('should make successful GET request', async () => {
      const mockResponse = {
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
        data: { message: 'success' }
      };

      (axios as jest.MockedFunction<typeof axios>).mockResolvedValueOnce(mockResponse);

      const result = await tool.execute({
        url: 'https://api.example.com/data'
      });

      expect(result.success).toBe(true);
      expect(result.status).toBe(200);
      expect(result.data).toEqual({ message: 'success' });
      expect(axios).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://api.example.com/data',
          method: 'GET',
          timeout: 30000
        })
      );
    });

    it('should use GET as default method', async () => {
      (axios as jest.MockedFunction<typeof axios>).mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: {}
      });

      await tool.execute({
        url: 'https://api.example.com/data'
      });

      expect((axios as jest.MockedFunction<typeof axios>)).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET'
        })
      );
    });
  });

  describe('POST requests', () => {
    it('should make POST request with data', async () => {
      const mockResponse = {
        status: 201,
        statusText: 'Created',
        headers: {},
        data: { id: 123 }
      };

      (axios as jest.MockedFunction<typeof axios>).mockResolvedValueOnce(mockResponse);

      const result = await tool.execute({
        url: 'https://api.example.com/users',
        method: 'POST',
        data: { name: 'John', email: 'john@example.com' }
      });

      expect(result.success).toBe(true);
      expect(result.status).toBe(201);
      expect(result.data).toEqual({ id: 123 });
      expect((axios as jest.MockedFunction<typeof axios>)).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          data: { name: 'John', email: 'john@example.com' }
        })
      );
    });
  });

  describe('PUT requests', () => {
    it('should make PUT request', async () => {
      (axios as jest.MockedFunction<typeof axios>).mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: { updated: true }
      });

      const result = await tool.execute({
        url: 'https://api.example.com/users/123',
        method: 'PUT',
        data: { name: 'Jane' }
      });

      expect(result.success).toBe(true);
      expect(result.status).toBe(200);
      expect((axios as jest.MockedFunction<typeof axios>)).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'PUT'
        })
      );
    });
  });

  describe('DELETE requests', () => {
    it('should make DELETE request', async () => {
      (axios as jest.MockedFunction<typeof axios>).mockResolvedValueOnce({
        status: 204,
        statusText: 'No Content',
        headers: {},
        data: null
      });

      const result = await tool.execute({
        url: 'https://api.example.com/users/123',
        method: 'DELETE'
      });

      expect(result.success).toBe(true);
      expect(result.status).toBe(204);
    });
  });

  describe('custom headers', () => {
    it('should include custom headers', async () => {
      (axios as jest.MockedFunction<typeof axios>).mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: {}
      });

      await tool.execute({
        url: 'https://api.example.com/data',
        headers: {
          'Authorization': 'Bearer token123',
          'Content-Type': 'application/json'
        }
      });

      expect((axios as jest.MockedFunction<typeof axios>)).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: {
            'Authorization': 'Bearer token123',
            'Content-Type': 'application/json'
          }
        })
      );
    });
  });

  describe('error handling', () => {
    it('should handle network errors', async () => {
      (axios as jest.MockedFunction<typeof axios>).mockRejectedValueOnce(new Error('Network error'));

      const result = await tool.execute({
        url: 'https://api.example.com/data'
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Network error');
    });

    it('should handle HTTP errors with response', async () => {
      const error: any = new Error('Request failed');
      error.response = {
        status: 404,
        data: { message: 'Not found' }
      };

      (axios as jest.MockedFunction<typeof axios>).mockRejectedValueOnce(error);

      const result = await tool.execute({
        url: 'https://api.example.com/notfound'
      });

      expect(result.success).toBe(false);
      expect(result.status).toBe(404);
      expect(result.data).toEqual({ message: 'Not found' });
    });
  });

  describe('timeout configuration', () => {
    it('should set 30 second timeout', async () => {
      (axios as jest.MockedFunction<typeof axios>).mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: {}
      });

      await tool.execute({
        url: 'https://api.example.com/data'
      });

      expect((axios as jest.MockedFunction<typeof axios>)).toHaveBeenCalledWith(
        expect.objectContaining({
          timeout: 30000
        })
      );
    });
  });
});
