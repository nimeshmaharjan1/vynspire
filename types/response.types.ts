import type { UserType } from "./user.types";

export type authSuccessResponseType = {
	token: string;
	user: UserType;
};
