import axios from 'axios';

const API_URL = 'http://localhost:8000/api/users';

// Récupérer la liste des utilisateurs avec pagination et filtrage
export const getUsers = async (params: {
  page?: number;
  limit?: number;
  role?: string;
  username?: string;
}) => {
  try {
    const response = await axios.get(API_URL, { params });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs", error);
    throw error;
  }
};

// Créer un utilisateur
export const createUser = async (userData: { username: string; password: string; role: string }) => {
  try {
    const response = await axios.post(API_URL, userData);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur", error);
    throw error;
  }
};

// Supprimer un utilisateur
export const deleteUser = async (userId: string) => {
  try {
    const response = await axios.delete(`${API_URL}/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur", error);
    throw error;
  }
};

// Supprimer plusieurs utilisateurs
export const deleteMultipleUsers = async (userIds: string[]) => {
  try {
    const response = await axios.delete(API_URL, { data: { ids: userIds } });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la suppression des utilisateurs", error);
    throw error;
  }
};