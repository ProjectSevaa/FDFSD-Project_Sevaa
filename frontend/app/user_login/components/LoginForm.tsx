import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Define Zod schema for each form field
const UsernameSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters."),
});

const PasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type UsernameFormInputs = z.infer<typeof UsernameSchema>;
type PasswordFormInputs = z.infer<typeof PasswordSchema>;

interface LoginFormProps {
  onSubmit: SubmitHandler<UsernameFormInputs | PasswordFormInputs>;
  formStep: "username" | "password";
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, formStep }) => {
  const form = useForm<UsernameFormInputs | PasswordFormInputs>({
    resolver: zodResolver(
      formStep === "username" ? UsernameSchema : PasswordSchema
    ),
    defaultValues:
      formStep === "username" ? { username: "" } : { password: "" },
  });

  // Reset the form fields when the step changes
  const resetForm = () =>
    form.reset(formStep === "username" ? { username: "" } : { password: "" });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit(onSubmit)(e);
        resetForm(); // Clear the input field
      }}
      className="space-y-6"
    >
      {formStep === "username" ? (
        <div>
          <label htmlFor="username" className="block">
            Username
          </label>
          <Input
            {...form.register("username")}
            placeholder="Enter your username"
          />
        </div>
      ) : (
        <div>
          <label htmlFor="password" className="block">
            Password
          </label>
          <Input
            {...form.register("password")}
            type="password"
            placeholder="Enter your password"
          />
        </div>
      )}
      <Button type="submit">
        {formStep === "username" ? "Next" : "Login"}
      </Button>
    </form>
  );
};
