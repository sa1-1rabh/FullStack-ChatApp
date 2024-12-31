import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  setSelectedUser: (user) => {
    set({ selectedUser: user });
  },

  getUsers: async () => {
    try {
      set({ isUsersLoading: true });
      const res = await axiosInstance.get("/message/users");
      // console.log("res->", res);
      set({ users: res.data });
      toast.success("Fetched Users");
    } catch (err) {
      toast.error(err.response.data.msg);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    try {
      set({ isMessagesLoading: true });
      const res = await axiosInstance.get(`/message/${userId}`);
      set({ messages: res.data });
      toast.success("Fetched Messages!");
    } catch (err) {
      toast.error(err.response.data.msg);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (msgData) => {
    try {
      const { selectedUser, messages } = get();
      // console.log("selectedUser-", selectedUser);
      const res = await axiosInstance.post(
        `message/send/${selectedUser._id}`,
        msgData
      );
      set({ messages: [...messages, res.data] });
    } catch (err) {
      toast.error("Message Can't be Sent!");
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      if (newMessage.senderId !== selectedUser._id) return;
      set({ messages: [...get().messages, newMessage] });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },
}));
