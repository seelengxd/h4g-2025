import { zodResolver } from "@hookform/resolvers/zod";
import { logInAuthLoginPost } from "@/api";
import ErrorAlert from "@/components/form/fields/error-alert";
import PasswordField from "@/components/form/fields/password-field";
import TextField from "@/components/form/fields/text-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useUserStore } from "@/store/user/user-store-provider";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";

const loginFormSchema = z.object({
  username: z.string(),
  password: z.string(),
});

type LoginForm = z.infer<typeof loginFormSchema>;

const loginFormDefault = {
  username: "",
  password: "",
};

const Login = () => {
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: loginFormDefault,
  });

  const [isError, setIsError] = useState(false);
  const { user, setUser, isLoading } = useUserStore((store) => store);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  console.log({ isLoading, user });
  if (isLoading || user) {
    return;
  }

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    const response = await logInAuthLoginPost({
      body: data,
      headers: undefined,
      withCredentials: true,
    });

    if (response.error) {
      setIsError(true);
    } else {
      setIsError(false);
      setUser(response.data.user);
      navigate("/");
    }
  };
  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <main className="">
        <h1 className="text-2xl">Minimart</h1>
        <Card className="mt-8 p-8">
          <CardContent>
            <div className="space-y-6">
              {isError && (
                <ErrorAlert
                  message={
                    " Your username or password is incorrect. Please try again."
                  }
                />
              )}
              <Form {...form}>
                <form
                  className="space-y-10"
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  <div className="space-y-4">
                    <TextField label="Username" name="username" />
                    <PasswordField label="Password" name="password" />
                  </div>
                  <Button
                    className="w-full bg-blue-300 hover:opacity-80"
                    type="submit"
                  >
                    Log in
                  </Button>
                </form>
              </Form>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Login;
