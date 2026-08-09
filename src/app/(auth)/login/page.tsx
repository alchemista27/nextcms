import { LoginForm } from "./login-form";

export const metadata = {
  title: "Login - Alfida CMS",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-gradient-to-br from-primary-dark to-primary">
      <LoginForm />
    </div>
  );
}
