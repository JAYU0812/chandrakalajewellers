# Database Migration Schema Design

## 1. Schema Relationships
* **admin_roles:** Authenticated accounts permission mapping.
* **metal_rates:** Log of daily precious metal market prices.
* **products:** Core physical parameters catalog (weights, labor).
* **categories & collections:** Classification taxonomies.
* **appointments:** Customer viewing schedule reservations.
* **audit_logs:** Change record tracking.

## 2. Dynamic Estimation View (`vw_product_current_pricing`)
Calculates prices dynamically using:
$$\text{Price} = \left(\text{Weight} \times \text{Live Rate} \times \left(1 + \frac{\text{Wastage\%}}{100}\right)\right) + \left(\text{Weight} \times \text{Labor}\right) + \text{Gemstones}$$
Provides real-time estimation pricing including standard 3% GST tax calculations.

## 3. Auditing Triggers
Binds post-write operations (`INSERT`, `UPDATE`, `DELETE`) on catalog and rates to log changes to the immutable `audit_logs` table.
