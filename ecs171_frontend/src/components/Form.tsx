import React, { useState } from "react";

type ModelType = "rf" | "log-reg" | "nn";

const Form = () => {
  // Define minimum values for numeric fields
  const fieldMins = {
    age: 0,
    capital_gain: 0,
    capital_loss: 0,
    hours_per_week: 0,
    education_num: 0,
  };

  const [formData, setFormData] = useState({
    age: "",
    capital_gain: "",
    capital_loss: "",
    hours_per_week: "",
    education_num: "",
    workclass: "",
    marital_status: "",
    occupation: "",
    relationship: "",
    sex: "",
  });

  const [results, setResults] = useState<null | {
    message: string;
    data: {
      age: string;
      capital_gain: string;
      capital_loss: string;
      hours_per_week: string;
      education_num: string;
      workclass: string;
      marital_status: string;
      occupation: string;
      relationship: string;
      sex: string;
      income_chance: string;
    };
  }>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedModel, setSelectedModel] = useState<ModelType>("log-reg"); // Defaulted to Logistic Regression

  const modelEndpoints: Record<ModelType, string> = {
    rf: "/predict/rf",
    "log-reg": "/predict/log-reg",
    nn: "/predict/nn",
  };

  const workclassOptions = [
    "Federal-gov",
    "Local-gov",
    "Private",
    "Self-emp-inc",
    "Self-emp-not-inc",
    "State-gov",
    "Without-pay",
  ];

  const maritalStatusOptions = [
    "Divorced",
    "Married-AF-spouse",
    "Married-civ-spouse",
    "Married-spouse-absent",
    "Never-married",
    "Separated",
    "Widowed",
  ];

  const occupationOptions = [
    "Adm-clerical",
    "Armed-Forces",
    "Craft-repair",
    "Exec-managerial",
    "Farming-fishing",
    "Handlers-cleaners",
    "Machine-op-inspct",
    "Other-service",
    "Priv-house-serv",
    "Prof-specialty",
    "Protective-serv",
    "Sales",
    "Tech-support",
    "Transport-moving",
  ];

  const relationshipOptions = [
    "Husband",
    "Not-in-family",
    "Other-relative",
    "Own-child",
    "Unmarried",
    "Wife",
  ];

  const sexOptions = ["Female", "Male"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Check for empty fields
    for (const [field, value] of Object.entries(formData)) {
      if (value === "") {
        setError(`Please fill in all fields`);
        setLoading(false);
        return;
      }
    }

    // Validate numeric fields
    const numericFields = {
      age: parseInt(formData.age),
      capital_gain: parseInt(formData.capital_gain),
      capital_loss: parseInt(formData.capital_loss),
      hours_per_week: parseInt(formData.hours_per_week),
      education_num: parseInt(formData.education_num),
    };

    // Validate numeric ranges
    for (const [field, value] of Object.entries(numericFields)) {
      if (isNaN(value)) {
        setError(`${field.replace("_", " ")} must be a number`);
        setLoading(false);
        return;
      }

      const min = fieldMins[field as keyof typeof fieldMins];
      if (value < min) {
        setError(
          `${field.replace("_", " ")} must be greater than or equal to ${min}`
        );
        setLoading(false);
        return;
      }
    }

    try {
      const response = await fetch(
        `http://localhost:8000${modelEndpoints[selectedModel]}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            age: numericFields.age,
            capital_gain: numericFields.capital_gain,
            capital_loss: numericFields.capital_loss,
            hours_per_week: numericFields.hours_per_week,
            education_num: numericFields.education_num,
            workclass: formData.workclass,
            marital_status: formData.marital_status,
            occupation: formData.occupation,
            relationship: formData.relationship,
            sex: formData.sex,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || `Server responded with status: ${response.status}`
        );
      }

      const data = await response.json();
      console.log("Success:", data);
      setResults({
        message: "Prediction successful",
        data: {
          ...formData,
          income_chance: data.prediction,
        },
      });
    } catch (error) {
      console.error("Error:", error);
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNumericChange = (field: string, value: string) => {
    // Allow empty string for better UX while typing
    if (value === "") {
      setFormData({ ...formData, [field]: value });
      return;
    }

    // Allow typing numbers
    if (/^\d*$/.test(value)) {
      setFormData({ ...formData, [field]: value });
    }
  };

  const inputClasses =
    "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200";
  const labelClasses = "block text-sm font-medium text-gray-700";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-lg p-8 space-y-6 mb-6"
        >
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
            Income Prediction Form
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Model Selection */}
            <div className="space-y-2 md:col-span-2">
              <label className={labelClasses}>Select Model</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value as ModelType)}
                className={inputClasses}
                required
              >
                <option value="rf">Random Forest</option>
                <option value="log-reg">Logistic Regression</option>
                <option value="nn">Neural Network</option>
              </select>
            </div>

            {/* Numeric Fields */}
            <div className="space-y-2">
              <label className={labelClasses}>
                Age
                <span className="text-gray-500 text-xs ml-2">
                  (≥ {fieldMins.age} years)
                </span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={formData.age}
                onChange={(e) => handleNumericChange("age", e.target.value)}
                className={inputClasses}
                placeholder="Enter age"
                required
              />
            </div>

            <div className="space-y-2">
              <label className={labelClasses}>
                Capital Gain
                <span className="text-gray-500 text-xs ml-2">
                  (≥ ${fieldMins.capital_gain})
                </span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={formData.capital_gain}
                onChange={(e) =>
                  handleNumericChange("capital_gain", e.target.value)
                }
                className={inputClasses}
                placeholder="Enter capital gain"
                required
              />
            </div>

            <div className="space-y-2">
              <label className={labelClasses}>
                Capital Loss
                <span className="text-gray-500 text-xs ml-2">
                  (≥ ${fieldMins.capital_loss})
                </span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={formData.capital_loss}
                onChange={(e) =>
                  handleNumericChange("capital_loss", e.target.value)
                }
                className={inputClasses}
                placeholder="Enter capital loss"
                required
              />
            </div>

            <div className="space-y-2">
              <label className={labelClasses}>
                Work Hours per Week
                <span className="text-gray-500 text-xs ml-2">
                  (≥ {fieldMins.hours_per_week} hours)
                </span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={formData.hours_per_week}
                onChange={(e) =>
                  handleNumericChange("hours_per_week", e.target.value)
                }
                className={inputClasses}
                placeholder="Enter hours per week"
                required
              />
            </div>

            <div className="space-y-2">
              <label className={labelClasses}>
                Education Number
                <span className="text-gray-500 text-xs ml-2">
                  (≥ {fieldMins.education_num})
                </span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={formData.education_num}
                onChange={(e) =>
                  handleNumericChange("education_num", e.target.value)
                }
                className={inputClasses}
                placeholder="Enter education number"
                required
              />
            </div>

            {/* Categorical Fields */}
            <div className="space-y-2">
              <label className={labelClasses}>Workclass</label>
              <select
                value={formData.workclass}
                onChange={(e) =>
                  setFormData({ ...formData, workclass: e.target.value })
                }
                className={inputClasses}
                required
              >
                <option value="">Select workclass</option>
                {workclassOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className={labelClasses}>Marital Status</label>
              <select
                value={formData.marital_status}
                onChange={(e) =>
                  setFormData({ ...formData, marital_status: e.target.value })
                }
                className={inputClasses}
                required
              >
                <option value="">Select marital status</option>
                {maritalStatusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className={labelClasses}>Occupation</label>
              <select
                value={formData.occupation}
                onChange={(e) =>
                  setFormData({ ...formData, sex: e.target.value })
                }
                className={inputClasses}
                required
              >
                <option value="">Select occupation</option>
                {occupationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className={labelClasses}>Relationship</label>
              <select
                value={formData.relationship}
                onChange={(e) =>
                  setFormData({ ...formData, relationship: e.target.value })
                }
                className={inputClasses}
                required
              >
                <option value="">Select relationship</option>
                {relationshipOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className={labelClasses}>Sex</label>
              <select
                value={formData.sex}
                onChange={(e) =>
                  setFormData({ ...formData, sex: e.target.value })
                }
                className={inputClasses}
                required
              >
                <option value="">Select sex</option>
                {sexOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${loading ? "bg-gray-400" : "bg-black hover:bg-gray-800"
              } text-white py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium`}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold mb-2">Error</h3>
            <p>{error}</p>
          </div>
        )}

        {results && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="border-t border-b border-gray-200 py-4 mb-4">
              <p className="text-gray-600 mb-1 text-sm">
                Submitted Information:
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(results.data).map(([key, value]) => (
                    <React.Fragment key={key}>
                      <p className="font-semibold">{key.replace("_", " ")}:</p>
                      <p>{value}</p>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Form;