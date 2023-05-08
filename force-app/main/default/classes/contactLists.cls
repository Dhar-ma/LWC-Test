/**
 * @description       :
 * @author            :
 * @group             :
 * @last modified on  : 05-03-2023
 * @last modified by  :
 **/
public class contactLists {
  public List<Account> getAccounts() {
    return [
      SELECT id, name, (SELECT id, FirstName, LastName FROM Contacts)
      FROM Account
      WHERE id IN (SELECT accountid FROM contact WHERE accountid != NULL)
    ];
  }
}
