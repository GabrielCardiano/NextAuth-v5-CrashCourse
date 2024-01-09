import { CardWrapper } from "@/components/auth/card-wrapper";

export function LoginForm() {
  return (
    <CardWrapper
      headerLabel="Welcome back"
      backButtonLabel="Don't you have an account?"
      backButtonHref="/auth/register"
      showSocial
    >
      CardWrapper
    </CardWrapper>
  )
}