import { useMutation } from "@tanstack/react-query";
import apiClient from "../apiClient";
import { UserInfo } from "../types/UserInfo";

type UserSignInRequestDto = {
    email: string,
    password: string,
};

type UserSignUpRequestDto = {
    username: string,
    email: string,
    password: string,
};

export const useSignInMutation = () => useMutation({
    mutationFn: async (user: UserSignInRequestDto) => {
        const response = await apiClient.post<UserInfo>('api/users/signin', user);
        return response.data;
    }
});

export const useSignUpMutation = () => useMutation({
    mutationFn: async (user: UserSignUpRequestDto) => {
        const response = await apiClient.post<UserInfo>('api/users/signup', user);
        return response.data;
    }
});