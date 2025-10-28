// services/userService.ts
import type { UserUpdateRequest } from '@/types/user'

export const userService = {
  async update(payload: UserUpdateRequest, accessToken: string) {
    const config = useRuntimeConfig()
    console.log('Payload enviado para atualização do usuário:', payload);
    console.log('Access Token:', accessToken);
    console.log('API Base URL:', config.public.apiBaseUrl);
    return await $fetch(`${config.public.apiBaseUrl}/api/v1/users/update`, {
      method: 'PUT',
      body: JSON.stringify(payload),
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })
  },
}
