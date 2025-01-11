import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { getUser, useUpdateUser } from "@/features/users/queries";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { GoPerson } from "react-icons/go";
import { useParams } from "react-router";

const getRandomPassword = () => {
  const asciiLetters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digits = "0123456789";
  const characters = asciiLetters + digits;

  const randomPassword = Array.from(
    { length: 8 },
    () => characters[Math.floor(Math.random() * characters.length)]
  ).join("");
  return randomPassword;
};

const User = () => {
  const { id } = useParams<"id">();
  const { data: user } = useQuery(getUser(Number(id)));
  const updateUserMutation = useUpdateUser(Number(id));
  const [password, setPassword] = useState("");

  if (!user) {
    return null;
  }

  const toggleSuspension = () => {
    updateUserMutation.mutate({
      ...user,
      suspended: !user.suspended,
    });
  };

  const resetPassword = () => {
    const newPassword = getRandomPassword();
    updateUserMutation.mutate(
      {
        ...user,
        password: newPassword,
      },
      {
        onSettled: () => {
          setPassword(newPassword);
        },
      }
    );
  };

  return (
    <div className="flex flex-col">
      {password && (
        <Dialog open onOpenChange={() => setPassword("")}>
          <DialogContent className="sm:max-w-[425px] bg-slate-50">
            <h3 className="text-2xl font-light">Password reset</h3>
            <p>
              The new password for <strong>{user.full_name}</strong> is{" "}
              <strong>{password}</strong>
            </p>
          </DialogContent>
        </Dialog>
      )}
      {/* User data */}
      <div className="flex gap-4">
        {user.image ? (
          <img
            src={import.meta.env.VITE_BACKEND_URL + "/uploads/" + user.image}
            alt="user"
            className="w-20 h-20 rounded-full"
          />
        ) : (
          <GoPerson className="w-20 h-20" />
        )}
        <div>
          <div>
            <span className="text-2xl font-light">{user.full_name} </span>
            <span className="italic">[@{user.username}]</span>
          </div>
          <span className="text-slate-500">{user.points} PTS</span>
          <div>
            {user.suspended ? (
              <Badge variant={"destructive"} className="bg-red-300">
                Suspended
              </Badge>
            ) : (
              <Badge variant={"outline"}>Active</Badge>
            )}
          </div>
        </div>
      </div>
      <hr className="mt-6" />
      <div className="flex flex-col mt-4">
        <h3 className="mb-2 leading-4 tracking-tight text-slate-600">
          Manage resident
        </h3>
        <div className="grid sm:grid-cols-2 sm:gap-4">
          <Button variant={"secondary"} onClick={resetPassword}>
            Reset Password
          </Button>
          <Button variant={"secondary"} onClick={toggleSuspension}>
            Suspend
          </Button>
        </div>
      </div>
      <hr className="mt-6" />
      {/* User History */}
      <div className="mt-4">
        <h3 className="mb-2 leading-4 tracking-tight text-slate-600">
          History
        </h3>
        <div>Coming soon...</div>
      </div>
    </div>
  );
};

export default User;
