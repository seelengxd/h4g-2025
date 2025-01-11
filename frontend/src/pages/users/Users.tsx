import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import NewUserFormDialog from "@/features/users/new-user-form";
import { getUsers } from "@/features/users/queries";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { GoChevronRight, GoPerson, GoPersonAdd } from "react-icons/go";
import { Link } from "react-router";

const clean = (str: string) => str.toLowerCase().replace(/\s/, "");
const Users = () => {
  const { data: users } = useQuery(getUsers());
  const [search, setSearch] = useState("");
  return (
    <>
      <div>
        <div className="flex justify-between">
          <h1 className="text-2xl font-light">Manage residents</h1>
          <NewUserFormDialog>
            <Button>
              <GoPersonAdd /> Add resident
            </Button>
          </NewUserFormDialog>
        </div>

        <Input
          placeholder="Search residents"
          className="mt-4"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
        <hr className="my-4" />
      </div>
      <div className="flex flex-col gap-6">
        {users &&
          users
            .filter((user) => clean(user.full_name).includes(clean(search)))
            .map((user) => (
              <div className="flex justify-between" key={user.id}>
                {/* TODO: add user image */}
                <div className="flex items-center gap-4">
                  {user.image ? (
                    <img
                      src={
                        import.meta.env.VITE_BACKEND_URL +
                        "/uploads/" +
                        user.image
                      }
                      alt="user"
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <GoPerson className="w-10 h-10" />
                  )}
                  {/* {JSON.stringify(user)} */}
                  <div className="flex flex-col">
                    <span>{user.full_name} </span>
                    <span className="text-sm italic">@{user.username}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">{user.points} PTS</span>
                  <Link to={`/users/${user.id}`}>
                    <GoChevronRight className="w-6 h-6" />
                  </Link>
                </div>
              </div>
            ))}
      </div>
    </>
  );
};

export default Users;
