import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";
import { signUp } from "@/app/auth/actions";

export default function SignupPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="Join Chefie and start cooking with your voice helper."
    >
      <AuthForm mode="signup" action={signUp} />
    </AuthShell>
  );
}
