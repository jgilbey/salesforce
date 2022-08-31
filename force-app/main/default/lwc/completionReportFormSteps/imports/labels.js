import Project_Number from "@salesforce/label/c.Project_Number";
import Project_title from "@salesforce/label/c.Project_title";
import Grant_expiry_date from "@salesforce/label/c.Grant_expiry_date";
import total_project_costs from "@salesforce/label/c.total_project_costs";
import grant_award from "@salesforce/label/c.grant_award";
import grant_percentage from "@salesforce/label/c.grant_percentage";
import Listed_below_are_your_approved_purposes_Please_provide_a_summary_of_your_projec from "@salesforce/label/c.Listed_below_are_your_approved_purposes_Please_provide_a_summary_of_your_projec";
import Have_you_received_any_new_permissions_during_the_period_covered_by_this_report from "@salesforce/label/c.Have_you_received_any_new_permissions_during_the_period_covered_by_this_report";
import Please_provide_further_information from "@salesforce/label/c.Please_provide_further_information";
import Have_you_raised_any_more_partnership_funding_since_the_last_report from "@salesforce/label/c.Have_you_raised_any_more_partnership_funding_since_the_last_report";
import Add_Project_Incomes from "@salesforce/label/c.Add_Project_Incomes";
import Have_you_purchased_goods_work_or_services_worth_more_than_10_000_in_the_period from "@salesforce/label/c.Have_you_purchased_goods_work_or_services_worth_more_than_10_000_in_the_period";
import Give_details_of_any_goods_work_or_services_you_have_purchased_so_far_worth_mor from "@salesforce/label/c.Give_details_of_any_goods_work_or_services_you_have_purchased_so_far_worth_mor";
import If_you_did_not_award_to_the_lowest_tender_please_give_details_of_why from "@salesforce/label/c.If_you_did_not_award_to_the_lowest_tender_please_give_details_of_why";
import Were_any_of_the_contractors_suppliers_or_consultants_linked_i_e_close_friend from "@salesforce/label/c.Were_any_of_the_contractors_suppliers_or_consultants_linked_i_e_close_friend";
import Please_explain_why_the_contractor_supplier_or_consultant_was_appointed from "@salesforce/label/c.Please_explain_why_the_contractor_supplier_or_consultant_was_appointed";
import Please_attached_high_resolution_images_of_the_item_or_items_you_have_acquired_N from "@salesforce/label/c.Please_attached_high_resolution_images_of_the_item_or_items_you_have_acquired_N";
import Please_provide_details_on_any_lessons_learned_relating_to_your_acquisition from "@salesforce/label/c.Please_provide_details_on_any_lessons_learned_relating_to_your_acquisition";
import Describe_how_you_acknowledged_your_NHMF_funding_and_include_information_on_t from "@salesforce/label/c.Describe_how_you_acknowledged_your_NHMF_funding_and_include_information_on_t";
import Please_now_attach_any_supporting_documents_required from "@salesforce/label/c.Please_now_attach_any_supporting_documents_required";
import inform_any_substantive_changes_budget from "@salesforce/label/c.Inform_any_substantive_changes_budget";
import grant_paid_so_far_PF from "@salesforce/label/c.Grant_paid_so_far_PF";
import paid_so_far_as_a_percentage from "@salesforce/label/c.Paid_so_far_as_a_percentage";

export default {
  intro: {
    Project_Number,
    Project_title,
    Grant_expiry_date,
    total_project_costs,
    grant_award,
    grant_percentage
  },
  approvedPurpose: {
    Listed_below_are_your_approved_purposes_Please_provide_a_summary_of_your_projec
  },
  statutoryPermissions: {
    Have_you_received_any_new_permissions_during_the_period_covered_by_this_report,
    Please_provide_further_information
  },
  funding: {
    Have_you_raised_any_more_partnership_funding_since_the_last_report,
    Add_Project_Incomes
  },
  paymentRequest: {
    inform_any_substantive_changes_budget,
    grant_paid_so_far_PF,
    paid_so_far_as_a_percentage
  },
  suppliers: {
    Have_you_purchased_goods_work_or_services_worth_more_than_10_000_in_the_period,
    Give_details_of_any_goods_work_or_services_you_have_purchased_so_far_worth_mor,
    If_you_did_not_award_to_the_lowest_tender_please_give_details_of_why,
    Were_any_of_the_contractors_suppliers_or_consultants_linked_i_e_close_friend,
    Please_explain_why_the_contractor_supplier_or_consultant_was_appointed
  },
  images: {
    Please_attached_high_resolution_images_of_the_item_or_items_you_have_acquired_N
  },
  fundingAcknowledgement: {
    Describe_how_you_acknowledged_your_NHMF_funding_and_include_information_on_t,
    Please_provide_details_on_any_lessons_learned_relating_to_your_acquisition
  },
  submission: {
    Please_now_attach_any_supporting_documents_required
  }
};