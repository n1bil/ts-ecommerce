import { useMutation } from "@tanstack/react-query";
import apiClient from "../apiClient";
import { UserInfo } from "../types/UserInfo";

type UserRequestDto = {
    email: string,
    password: string,
};

export const useSignInMutation = () => useMutation({
    mutationFn: async (user: UserRequestDto) => {
        const response = await apiClient.post<UserInfo>('api/users/signin', user);
        return response.data;
    }
});