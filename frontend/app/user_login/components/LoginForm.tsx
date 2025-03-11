import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";

// Define Zod schema for each form field
const EmailSchema = z.object({
    email: z
        .string()
        .email("Invalid email format.")
        .min(5, "Email must be at least 5 characters."),
});

const PasswordSchema = z.object({
    password: z.string().min(1, "Password must be at least 1 characters."),
});

type EmailFormInputs = z.infer<typeof EmailSchema>;
type PasswordFormInputs = z.infer<typeof PasswordSchema>;

interface LoginFormProps {
    onSubmit: SubmitHandler<EmailFormInputs | PasswordFormInputs>;
    formStep: "email" | "password";
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, formStep }) => {
    const form = useForm<EmailFormInputs | PasswordFormInputs>({
        resolver: zodResolver(
            formStep === "email" ? EmailSchema : PasswordSchema
        ),
        defaultValues: formStep === "email" ? { email: "" } : { password: "" },
    });

    // Reset the form fields when the step changes
    const resetForm = () =>
        form.reset(formStep === "email" ? { email: "" } : { password: "" });

    // Get the CSRF token from cookies
    const csrfToken = Cookies.get("XSRF-TOKEN");

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit(onSubmit)(e);
                resetForm(); // Clear the input field
            }}
            className="space-y-6"
        >
            {formStep === "email" ? (
                <div>
                    <label htmlFor="email" className="block">
                        Email
                    </label>
                    <Input
                        {...form.register("email")}
                        type="email"
                        placeholder="Enter your email"
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
            {/* Hidden input for CSRF token */}
            <input type="hidden" name="_csrf" value={csrfToken || ""} />
            <Button type="submit">
                {formStep === "email" ? "Next" : "Login"}
            </Button>
        </form>
    );
};
