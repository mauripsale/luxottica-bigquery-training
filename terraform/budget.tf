# Budget Alert and Native Spend Cap Trigger
resource "google_billing_budget" "ipsale_budget" {
  count           = var.billing_account_id != "" ? 1 : 0
  billing_account = var.billing_account_id
  display_name    = "IPSALE Engine Monthly Budget (${var.project_id})"

  budget_filter {
    projects = ["projects/${var.project_id}"]
  }

  amount {
    specified_amount {
      currency_code = "EUR"
      units         = tostring(floor(var.monthly_budget_amount))
    }
  }

  threshold_rules {
    threshold_percent = 0.5
  }
  threshold_rules {
    threshold_percent = 0.8
  }
  threshold_rules {
    threshold_percent = 1.0
  }
}

# IaC Bridge Pattern for Spend Cap Auto-Pause Script
resource "terraform_data" "spend_cap_trigger" {
  count = var.billing_account_id != "" && var.enable_spend_cap ? 1 : 0

  triggers_replace = [
    var.project_id,
    var.monthly_budget_amount
  ]

  provisioner "local-exec" {
    command = "${path.module}/scripts/manage_spend_cap.sh ${var.project_id} ${var.billing_account_id} ${var.monthly_budget_amount}"
  }
}
