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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={"icon-sm"} variant={"ghost"}>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel asChild>
          {employeeDto && (
            <article className="flex flex-col leading-tight text-center">
              <h3>{nameJoiner(employeeDto)}</h3>
              <p className="text-muted-foreground tracking-tight">
                {departmentUser(employeeDto.CURRENT_DPT_ID)}
              </p>
            </article>
          )}
        </DropdownMenuLabel>

        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogoutUser />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAvatar;
