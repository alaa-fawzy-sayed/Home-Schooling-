<?php
/**
 * Nova Learn - Input Validator
 */

namespace Core;

class Validator
{
    private array $errors = [];

    /**
     * Validate data against rules
     * Rules format: ['field' => 'required|email|min:3|max:255']
     */
    public function validate(array $data, array $rules): bool
    {
        $this->errors = [];

        foreach ($rules as $field => $ruleStr) {
            $value = $data[$field] ?? null;
            $ruleList = explode('|', $ruleStr);

            foreach ($ruleList as $rule) {
                $params = [];
                if (str_contains($rule, ':')) {
                    [$rule, $paramStr] = explode(':', $rule, 2);
                    $params = explode(',', $paramStr);
                }

                $method = 'rule_' . $rule;
                if (method_exists($this, $method)) {
                    $error = $this->$method($field, $value, $params);
                    if ($error) {
                        $this->errors[$field][] = $error;
                    }
                }
            }
        }

        return empty($this->errors);
    }

    public function errors(): array { return $this->errors; }
    public function fails(): bool { return !empty($this->errors); }

    // --- Validation Rules ---

    private function rule_required(string $field, $value): ?string
    {
        if ($value === null || $value === '' || $value === []) {
            return "{$field} is required";
        }
        return null;
    }

    private function rule_email(string $field, $value): ?string
    {
        if (!$value) return null;
        
        // Basic filter validation
        if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
            return "{$field} must be a valid email";
        }
        
        // Additional strict validation to prevent multiple @ symbols and other issues
        // Email format: local-part@domain
        if (substr_count($value, '@') !== 1) {
            return "{$field} must be a valid email";
        }
        
        // Check for consecutive dots or @ symbols
        if (preg_match('/\.{2,}|@{2,}/', $value)) {
            return "{$field} must be a valid email";
        }
        
        // Validate local part and domain structure
        if (!preg_match('/^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/', $value)) {
            return "{$field} must be a valid email";
        }
        
        return null;
    }

    private function rule_min(string $field, $value, array $params): ?string
    {
        $min = (int) $params[0];
        if (is_string($value) && mb_strlen($value) < $min) {
            return "{$field} must be at least {$min} characters";
        }
        if (is_numeric($value) && $value < $min) {
            return "{$field} must be at least {$min}";
        }
        return null;
    }

    private function rule_max(string $field, $value, array $params): ?string
    {
        $max = (int) $params[0];
        if (is_string($value) && mb_strlen($value) > $max) {
            return "{$field} must not exceed {$max} characters";
        }
        if (is_numeric($value) && $value > $max) {
            return "{$field} must not exceed {$max}";
        }
        return null;
    }

    private function rule_numeric(string $field, $value): ?string
    {
        if ($value && !is_numeric($value)) {
            return "{$field} must be numeric";
        }
        return null;
    }

    private function rule_integer(string $field, $value): ?string
    {
        if ($value && !filter_var($value, FILTER_VALIDATE_INT) && $value !== 0) {
            return "{$field} must be an integer";
        }
        return null;
    }

    private function rule_string(string $field, $value): ?string
    {
        if ($value !== null && !is_string($value)) {
            return "{$field} must be a string";
        }
        return null;
    }

    private function rule_in(string $field, $value, array $params): ?string
    {
        if ($value && !in_array($value, $params)) {
            return "{$field} must be one of: " . implode(', ', $params);
        }
        return null;
    }

    private function rule_unique(string $field, $value, array $params): ?string
    {
        if (!$value) return null;
        $table = $params[0];
        $column = $params[1] ?? $field;
        $exceptId = $params[2] ?? null;

        $db = Database::getInstance();
        $sql = "SELECT COUNT(*) FROM {$table} WHERE {$column} = ?";
        $p = [$value];
        if ($exceptId) {
            $sql .= " AND id != ?";
            $p[] = $exceptId;
        }
        if ($db->fetchColumn($sql, $p) > 0) {
            return "{$field} already exists";
        }
        return null;
    }

    private function rule_confirmed(string $field, $value): ?string
    {
        $confirmation = $_POST[$field . '_confirmation'] ?? null;
        if ($value !== $confirmation) {
            return "{$field} confirmation does not match";
        }
        return null;
    }

    private function rule_date(string $field, $value): ?string
    {
        if ($value && !strtotime($value)) {
            return "{$field} must be a valid date";
        }
        return null;
    }

    private function rule_url(string $field, $value): ?string
    {
        if ($value && !filter_var($value, FILTER_VALIDATE_URL)) {
            return "{$field} must be a valid URL";
        }
        return null;
    }
}
