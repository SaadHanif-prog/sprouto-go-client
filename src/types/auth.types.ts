export type Role = "admin" | "client" | "superadmin" | "developer";

// ---------------- SIGNUP ----------------

export type Signup = {
  id: string;
  accessToken?: string;

  role: Role;

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

  // ✅ Only used during signup
  subscription: {
    plan: "starter" | "pro";
    billingCycle: "monthly" | "annually";
  };

  createdAt: string;
  updatedAt: string;

  acceptTerms?: boolean;
};

// ❗ FIXED: remove wrong "userId"
export type CreateSignup = Omit<
  Signup,
  "id" | "createdAt" | "updatedAt"
>;

export type SignupApiResponse = {
  success: boolean;
  message: string;
  data: Omit<Signup, "password">;
};

// ---------------- LOGIN ----------------

export type Login = {
  email: string;
  password: string;
};

export type CreateLogin = Login;

// ⚠️ Login response DOES NOT include subscription in your backend
export type LoginApiResponse = {
  success: boolean;
  message: string;
  data: {
    isPaymentPlanActive: boolean,
    accessToken: string;
    id: string;

    firstname: string;
    surname: string;
    email: string;
    role: Role;

    company: {
      name: string;
      number: string;
    };

    address: {
      line1: string;
      city: string;
      county: string;
      postcode: string;
    };
  };
};

// ---------------- VERIFY ME ----------------

export type VerifyMe = {
  success: boolean;
  data: {
    id: string;
    accessToken: string;

    firstname: string;
    surname: string;
    email: string;
    role: Role;

    company: {
      name: string;
      number: string;
    };

    address: {
      line1: string;
      city: string;
      county: string;
      postcode: string;
    };
    addonentitlementid?: string[] | null;
    isPaymentPlanActive?: boolean,

  };
};

// ---------------- USER LIST ----------------

export type User = {
  id: string;
  firstname: string;
  surname: string;
  email: string;
  role: Role;
};

export type GetAllUsersApiResponse = {
  success: boolean;
  count: number;
  data: User[];
};

// ---------------- COMMON ----------------

export type ErrorResponse = { message: string };

export type LogoutApiResponse = {
  success: boolean;
  message: string;
};

// ================= FORGOT PASSWORD =================
export type ForgotPasswordPayload = {
  email: string;
};

export type ForgotPasswordResponse = {
  success: boolean;
  message: string;
};

// ================= RESET PASSWORD =================
export type ResetPasswordPayload = {
  password: string;
};

export type ResetPasswordResponse = {
  success: boolean;
  message: string;
};