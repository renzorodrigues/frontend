// types/user.ts
export interface UserUpdateRequest {
  cpfCnpj: string
  birthDate: string
  street: string
  number: string
  complement: string
  neighborhood: string
  city: string
  state: string
  postalCode: string
  mobilePhoneNumber: string
  landLinePhoneNumber: string
}
