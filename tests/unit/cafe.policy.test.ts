import { CafePolicy } from "../../src/policies/cafe.policy";
import { ROLES } from "../../src/constants/roles";

describe("CafePolicy.canUpdate", () => {
  it("allows SUPERADMIN to update any cafe", () => {
    const user = { id: "user1", role: ROLES.SUPERADMIN };
    const cafe = {
      managedBy: "another-user",
    } as any;
    expect(CafePolicy.canUpdate(user, cafe)).toBe(true);
  });

  it("allows ADMIN to update assigned cafe", () => {
    const user = { id: "admin1", role: ROLES.ADMIN };
    const cafe = {
      managedBy: { toString: () => "admin1" },
    } as any;
    expect(CafePolicy.canUpdate(user, cafe)).toBe(true);
  });

  it("denies ADMIN from updating unassigned cafe", () => {
    const user = { id: "admin1", role: ROLES.ADMIN };
    const cafe = {
      managedBy: { toString: () => "admin2" },
    } as any;
    expect(CafePolicy.canUpdate(user, cafe)).toBe(false);
  });

  it("denies USER from updating any cafe", () => {
    const user = { id: "user1", role: ROLES.USER };
    const cafe = {
      managedBy: null,
    } as any;
    expect(CafePolicy.canUpdate(user, cafe)).toBe(false);
  });
});
