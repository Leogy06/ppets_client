import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RootState } from "@/lib/store";
import { departmentUser, nameJoiner } from "@/lib/utils";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import React from "react";
import { useSelector } from "react-redux";
import LogoutUser from "./logout-user-btn";

const UserAvatar = () => {
  const employeeDto = useSelector((state: RootState) => state.auth.employee);

  return (
    <div className="flex items-center gap-2">
      {employeeDto && (
        <article className="flex justify-end items-end flex-col">
          <h3>{nameJoiner(employeeDto)}</h3>
          <p className="text-muted-foreground tracking-tight">
            {departmentUser(employeeDto.CURRENT_DPT_ID)}
          </p>
        </article>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"}>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="text-center font-semibold text-lg">
            Setting
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <LogoutUser />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserAvatar;
