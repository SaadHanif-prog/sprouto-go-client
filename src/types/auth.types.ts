export type Signup = {
  id: string; 

  role: "admin" | "client" | "superadmin" | "developer";

  title: "Mr" | "Mrs" | "Ms" | "Miss" | "Dr" | "Other";
  firstname: string;
  surname: string;

  email: string;
  password: string;

  company: {
    name: string;
    number: string;
  };

  address: {
    line1: string;
    county: string;
    city: string;
    postcode: string;
  };

  subscription: {
    plan: "starter" | "pro";
    billingCycle: "monthly" | "annually";
  };

  createdAt: string;
  updatedAt: string;
};

export type CreateSignup = Omit<
  Signup,
  "userId" | "createdAt" | "updatedAt"
>;

export type SignupApiResponse = {
  success: boolean;
  message: string;
  data: Omit<Signup, "password">;
};

export type Login = {
  email: string;
  password: string;
};

export type CreateLogin = Login;

export type LoginApiResponse = {
  success: boolean;
  message: string;
  data: Omit<Signup, "password">;
};

export type ErrorResponse = { message: string };

export type VerifyMe = {
  data: {
    id: string; 
    firstname: string;
    surname: string;
    email: string;
    role: "admin" | "client" | "superadmin" | "developer";
  };
};

export type LogoutApiResponse = {
  success: string;
  message: string;
};

export type User = {
  id: string;
  firstname: string;
  surname: string;
  email: string;
  role: "admin" | "client" | "superadmin" | "developer";
};

export type GetAllUsersApiResponse = {
  success: boolean;
  count: number;
  data: User[];
};