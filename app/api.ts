import { createUser } from "./endpoints/users/createUser.ts";
import { getUser } from "./endpoints/users/getUser.ts";
import { getUsers } from "./endpoints/users/getUsers.ts";
import { serve } from "../src/serve/serve.ts";

serve([getUser, getUsers, createUser]);
