/* 
Note: Constants roles, might be used for role-based access control
Todo: in the future, consider fetching these from the backend or a config file to allow dynamic role management without code changes
 */
export const ROLES = {
  ADMIN: 'admin',
  PEDAGOG: 'pedagog',
  STUDENT: 'student',
};

/* Default page size for pagination */
export const PAGE_SIZE = 10;
