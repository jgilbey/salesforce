import Project_Number from "@salesforce/label/c.Project_Number";
import Project_title from "@salesforce/label/c.Project_title";
import total_project_costs from "@salesforce/label/c.total_project_costs";
import intro_Total_grant_award from "@salesforce/label/c.Intro_Total_grant_award";
import grant_expiry_date from "@salesforce/label/c.Grant_expiry_date_PF";
import payment_percentage from "@salesforce/label/c.Payment_percentage";
import grant_paid_so_far_PF from "@salesforce/label/c.Grant_paid_so_far_PF";
import paid_so_far_as_a_percentage from "@salesforce/label/c.Paid_so_far_as_a_percentage";
import inform_any_substantive_changes_budget from "@salesforce/label/c.Inform_any_substantive_changes_budget";
import supporting_documents_label from "@salesforce/label/c.Supporting_documents_label";

import confirm from "@salesforce/label/c.confirm";
import Next_Step_Permission from "@salesforce/label/c.Next_Step_Permission";

export default {
  intro: {
    Project_Number,
    Project_title,
    total_project_costs,
    intro_Total_grant_award,
    grant_expiry_date,
    payment_percentage,
    grant_paid_so_far_PF,
    paid_so_far_as_a_percentage
  },
  paymentRequest:{
    inform_any_substantive_changes_budget
  },
  submission:{
    supporting_documents_label
  },
  nextStep: { Next_Step_Permission }
};