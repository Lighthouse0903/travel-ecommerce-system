import { EditAgencyFormValues } from "./formSchema";

export const buildUpdateAgencyFormData = (values: EditAgencyFormValues) => {
  const fd = new FormData();
  if (values.avatar) fd.append("avatar", values.avatar);

  fd.append("email_agency", values.email_agency.trim());
  fd.append("hotline", values.hotline.trim());
  fd.append("address_agency", values.address_agency.trim());

  fd.append("bank_name", values.bank_name.trim());
  fd.append("bank_account_number", values.bank_account_number.trim());
  fd.append("bank_account_holder", values.bank_account_holder.trim());

  fd.append("description", (values.description ?? "").trim());
  return fd;
};
