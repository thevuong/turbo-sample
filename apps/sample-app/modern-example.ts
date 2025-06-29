// Modern TypeScript Example demonstrating best practices from the style guide

// Modern type definitions with branded types
type UserId = string & { readonly brand: unique symbol };
type Email = string & { readonly brand: unique symbol };

// Modern interface definition
interface User {
  readonly id: UserId;
  name: string;
  email: Email;
  createdAt: Date;
  preferences?: UserPreferences;
}

interface UserPreferences {
  readonly theme: "light" | "dark";
  readonly notifications: boolean;
}

// Template literal types for type safety
type EventName = `on${Capitalize<string>}`;
type ApiEndpoint = `/api/v1/${string}`;

// Result pattern for error handling
type Result<T, E = Error> = { success: true; data: T } | { success: false; error: E };

// Modern class with readonly properties and proper typing
class UserService {
  private readonly apiUrl: ApiEndpoint = "/api/v1/users";

  constructor(private readonly httpClient: HttpClient) {}

  // Modern async function with proper error handling
  async fetchUser(id: UserId): Promise<Result<User>> {
    try {
      const response = await this.httpClient.get(`${this.apiUrl}/${id}`);
      const user = this.validateUser(response.data);
      return { success: true, data: user };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }

  // Modern array processing with proper typing
  async fetchMultipleUsers(userIds: readonly UserId[]): Promise<User[]> {
    const results = await Promise.allSettled(userIds.map(async id => this.fetchUser(id)));

    return results
      .filter(
        (result): result is PromiseFulfilledResult<Result<User>> =>
          result.status === "fulfilled" && result.value.success
      )
      .map(result => result.value.data);
  }

  // Modern function with destructuring and default parameters
  createUser = async ({
    name,
    email,
    preferences = { theme: "light", notifications: true },
  }: {
    name: string;
    email: Email;
    preferences?: UserPreferences;
  }): Promise<Result<User>> => {
    const newUser: User = {
      id: this.generateUserId(),
      name,
      email,
      createdAt: new Date(),
      preferences,
    };

    return this.saveUser(newUser);
  };

  // Modern utility methods with proper typing
  private validateUser(data: unknown): User {
    // In real implementation, use a validation library like Zod
    if (!this.isValidUserData(data)) {
      throw new Error("Invalid user data");
    }
    return data;
  }

  private isValidUserData(data: unknown): data is User {
    return typeof data === "object" && data !== null && "id" in data && "name" in data && "email" in data;
  }

  private generateUserId(): UserId {
    return crypto.randomUUID() as UserId;
  }

  private async saveUser(user: User): Promise<Result<User>> {
    try {
      const response = await this.httpClient.post(this.apiUrl, user);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }
}

// Modern utility functions with proper typing
const formatUserName = (user: User): string => {
  return user.name.trim().toLowerCase();
};

const isUserActive = (user: User): boolean => {
  const daysSinceCreation = Math.floor((Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24));
  return daysSinceCreation <= 30;
};

// Modern event handling with proper typing
const createEventHandler = <T>(eventName: EventName, handler: (data: T) => void): ((data: T) => void) => {
  return (data: T) => {
    console.log(`Handling event: ${eventName}`);
    handler(data);
  };
};

// Modern logger with structured logging
const logger = {
  info: (message: string, meta?: Record<string, unknown>): void => {
    console.log(
      JSON.stringify({
        level: "info",
        message,
        meta,
        timestamp: new Date().toISOString(),
      })
    );
  },
  error: (message: string, error?: Error, meta?: Record<string, unknown>): void => {
    console.error(
      JSON.stringify({
        level: "error",
        message,
        error: error?.message,
        stack: error?.stack,
        meta,
        timestamp: new Date().toISOString(),
      })
    );
  },
} as const;

// Modern HTTP client interface
interface HttpClient {
  get: (url: string) => Promise<{ data: unknown }>;
  post: (url: string, data: unknown) => Promise<{ data: unknown }>;
}

// Example usage demonstrating modern patterns
const demonstrateModernPatterns = async (): Promise<void> => {
  const httpClient: HttpClient = {
    get: async (url: string) => ({ data: {} }),
    post: async (url: string, data: unknown) => ({ data }),
  };

  const userService = new UserService(httpClient);

  // Modern destructuring and error handling
  const result = await userService.createUser({
    name: "John Doe",
    email: "john@example.com" as Email,
  });

  if (result.success) {
    logger.info("User created successfully", { userId: result.data.id });
  } else {
    logger.error("Failed to create user", result.error);
  }

  // Modern array processing
  const userIds: UserId[] = ["user1", "user2", "user3"] as UserId[];
  const users = await userService.fetchMultipleUsers(userIds);

  // Modern filtering and mapping
  const activeUsers = users.filter(isUserActive).map(user => ({
    ...user,
    displayName: formatUserName(user),
  }));

  logger.info("Active users processed", { count: activeUsers.length });
};

// Export for use in other modules
export type { User, UserPreferences, UserId, Email, Result };
export { UserService, logger, demonstrateModernPatterns };
