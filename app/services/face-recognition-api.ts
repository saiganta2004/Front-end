import axios from 'axios';

// This is the URL of your Python face recognition backend.
const FACE_API_URL = 'http://localhost:5000';

const faceApi = axios.create({
  baseURL: FACE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

interface RegisterFaceResponse {
  success: boolean;
  embedding?: number[];
  error?: string;
  message?: string;
}

export interface FaceRecognitionResponse {
  success: boolean;
  recognized: boolean;
  name?: string;
  confidence?: number;
  error?: string;
}

class FaceRecognitionAPI {
  // The 'email' parameter will be used as the 'user_id' for the Python service
  async registerFace(base64Image: string, email: string, name: string): Promise<RegisterFaceResponse> {
    try {
      // 1. Corrected the endpoint to '/register_face'
      // 2. Corrected the payload to send 'user_id' instead of 'email'
      const response = await faceApi.post<RegisterFaceResponse>('/register_face', {
        image: base64Image,
        user_id: email, // Using email as the unique user ID
        name: name,
      });
      return response.data;
    } catch (error) {
      console.error("Error registering face:", error);
      if (axios.isAxiosError(error) && error.response) {
        // Pass the specific error from the Python server back to the form
        return { success: false, error: error.response.data.error || 'An unknown error occurred on the face recognition server.' };
      }
      // This is the generic network error if the server is down
      return { success: false, error: 'Failed to connect to the face recognition service. Is the Python server running?' };
    }
  }

  async recognizeFace(imageBase64: string): Promise<FaceRecognitionResponse> {
    try {
      // Call the Python backend directly, not the Next.js API route
      const response = await faceApi.post<FaceRecognitionResponse>('/recognize_face', {
        image: imageBase64,
      });
      return response.data;
    } catch (error) {
      console.error("Error recognizing face:", error);
      if (axios.isAxiosError(error) && error.response) {
        return { success: false, recognized: false, error: error.response.data.error || 'An unknown error occurred on the face recognition server.' };
      }
      return { success: false, recognized: false, error: 'Failed to connect to the face recognition service. Is the Python server running?' };
    }
  }
}

export const faceRecognitionAPI = new FaceRecognitionAPI();
