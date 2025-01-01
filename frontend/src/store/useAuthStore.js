import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:8000" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      // console.log("res->", res.data);
      set({ authUser: res.data });
      get().connectSocket();
    } catch (err) {
      console.log("Error in Auth " + err);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    try {
      set({ isSigningUp: true });
      const res = await axiosInstance.post("/auth/signup", data);
      // console.log("res->", res);
      set({ authUser: res.data });
      toast.success("Account Created Successfully!");
      get().connectSocket();
    } catch (err) {
      toast.error(err.response.data.msg);
    } finally {
      set({ isSigningUp: false });
    }
  },

  logout: async () => {
    try {
      const res = await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged Out Successfully!");
      get().disconnectSocket();
    } catch (err) {
      toast.error(err.response.data.msg);
    }
  },

  login: async (data) => {
    try {
      set({ isLoggingIn: true });
      const res = await axiosInstance.post("/auth/login", data);
      // console.log("res->", res);
      set({ authUser: res.data });
      toast.success("Login Successfull!");
      get().connectSocket();
    } catch (err) {
      toast.error(err.response.data.msg);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  updateProfile: async (data) => {
    try {
      set({ isUpdatingProfile: true });
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile Pic Updated Successfully!");
    } catch (err) {
      toast.error(err.response.data.msg);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    // console.log("authUser-", authUser);
    if (!authUser || get().socket?.connected) {
      return;
    }
    const socket = io(BASE_URL, { query: { userId: authUser._id } });
    // console.log("socket-", socket);
    socket.connect();
    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      // console.log("userIds-", userIds);
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
