import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";

// PIN Code Data — PDF Section A3.3 (100+ sample PIN codes)
const PIN_CODE_DATA = {
  400001: { city: "Mumbai", state: "Maharashtra", postOffice: "Fort" },
  400051: { city: "Mumbai", state: "Maharashtra", postOffice: "Bandra" },
  400069: { city: "Mumbai", state: "Maharashtra", postOffice: "Andheri" },
  400070: { city: "Mumbai", state: "Maharashtra", postOffice: "Ghatkopar" },
  400080: { city: "Mumbai", state: "Maharashtra", postOffice: "Mulund" },
  110001: { city: "New Delhi", state: "Delhi", postOffice: "Connaught Place" },
  110011: { city: "New Delhi", state: "Delhi", postOffice: "Lodhi Road" },
  110020: { city: "New Delhi", state: "Delhi", postOffice: "Lajpat Nagar" },
  110025: { city: "New Delhi", state: "Delhi", postOffice: "Hauz Khas" },
  110092: { city: "New Delhi", state: "Delhi", postOffice: "Preet Vihar" },
  560001: {
    city: "Bengaluru",
    state: "Karnataka",
    postOffice: "Bangalore GPO",
  },
  560034: { city: "Bengaluru", state: "Karnataka", postOffice: "Indiranagar" },
  560076: { city: "Bengaluru", state: "Karnataka", postOffice: "Whitefield" },
  560103: {
    city: "Bengaluru",
    state: "Karnataka",
    postOffice: "Electronic City",
  },
  600001: { city: "Chennai", state: "Tamil Nadu", postOffice: "Chennai GPO" },
  600020: { city: "Chennai", state: "Tamil Nadu", postOffice: "Adyar" },
  600040: { city: "Chennai", state: "Tamil Nadu", postOffice: "Anna Nagar" },
  700001: { city: "Kolkata", state: "West Bengal", postOffice: "Kolkata GPO" },
  700019: { city: "Kolkata", state: "West Bengal", postOffice: "Ballygunge" },
  700064: { city: "Kolkata", state: "West Bengal", postOffice: "Salt Lake" },
  500001: {
    city: "Hyderabad",
    state: "Telangana",
    postOffice: "Hyderabad GPO",
  },
  500034: {
    city: "Hyderabad",
    state: "Telangana",
    postOffice: "Jubilee Hills",
  },
  500081: { city: "Hyderabad", state: "Telangana", postOffice: "Gachibowli" },
  380001: { city: "Ahmedabad", state: "Gujarat", postOffice: "Ahmedabad GPO" },
  380054: { city: "Ahmedabad", state: "Gujarat", postOffice: "Satellite" },
  411001: { city: "Pune", state: "Maharashtra", postOffice: "Pune City" },
  411045: { city: "Pune", state: "Maharashtra", postOffice: "Hinjewadi" },
  411057: { city: "Pune", state: "Maharashtra", postOffice: "Kharadi" },
  302001: { city: "Jaipur", state: "Rajasthan", postOffice: "Jaipur GPO" },
  302017: { city: "Jaipur", state: "Rajasthan", postOffice: "Vaishali Nagar" },
  226001: {
    city: "Lucknow",
    state: "Uttar Pradesh",
    postOffice: "Lucknow GPO",
  },
  226010: {
    city: "Lucknow",
    state: "Uttar Pradesh",
    postOffice: "Gomti Nagar",
  },
  800001: { city: "Patna", state: "Bihar", postOffice: "Patna GPO" },
  440001: { city: "Nagpur", state: "Maharashtra", postOffice: "Nagpur GPO" },
  201301: {
    city: "Noida",
    state: "Uttar Pradesh",
    postOffice: "Noida Sector 18",
  },
  201304: {
    city: "Noida",
    state: "Uttar Pradesh",
    postOffice: "Noida Sector 62",
  },
  122001: { city: "Gurugram", state: "Haryana", postOffice: "Gurugram GPO" },
  122002: { city: "Gurugram", state: "Haryana", postOffice: "DLF Phase 1" },
  160017: { city: "Chandigarh", state: "Chandigarh", postOffice: "Sector 17" },
  682001: { city: "Kochi", state: "Kerala", postOffice: "Ernakulam GPO" },
  682030: { city: "Kochi", state: "Kerala", postOffice: "Kakkanad" },
  751001: {
    city: "Bhubaneswar",
    state: "Odisha",
    postOffice: "Bhubaneswar GPO",
  },
  452001: { city: "Indore", state: "Madhya Pradesh", postOffice: "Indore GPO" },
  462001: { city: "Bhopal", state: "Madhya Pradesh", postOffice: "Bhopal GPO" },
  395001: { city: "Surat", state: "Gujarat", postOffice: "Surat GPO" },
  395007: { city: "Surat", state: "Gujarat", postOffice: "Vesu" },
  208001: { city: "Kanpur", state: "Uttar Pradesh", postOffice: "Kanpur GPO" },
  834001: { city: "Ranchi", state: "Jharkhand", postOffice: "Ranchi GPO" },
  781001: { city: "Guwahati", state: "Assam", postOffice: "Guwahati GPO" },
  248001: {
    city: "Dehradun",
    state: "Uttarakhand",
    postOffice: "Dehradun GPO",
  },
  171001: {
    city: "Shimla",
    state: "Himachal Pradesh",
    postOffice: "Shimla GPO",
  },
  190001: {
    city: "Srinagar",
    state: "Jammu & Kashmir",
    postOffice: "Srinagar GPO",
  },
  403001: { city: "Panaji", state: "Goa", postOffice: "Panaji GPO" },
  605001: {
    city: "Puducherry",
    state: "Puducherry",
    postOffice: "Puducherry GPO",
  },
  530001: {
    city: "Visakhapatnam",
    state: "Andhra Pradesh",
    postOffice: "Vizag GPO",
  },
  625001: { city: "Madurai", state: "Tamil Nadu", postOffice: "Madurai GPO" },
  641001: {
    city: "Coimbatore",
    state: "Tamil Nadu",
    postOffice: "Coimbatore GPO",
  },
  474001: {
    city: "Gwalior",
    state: "Madhya Pradesh",
    postOffice: "Gwalior GPO",
  },
  361001: { city: "Jamnagar", state: "Gujarat", postOffice: "Jamnagar GPO" },
  313001: { city: "Udaipur", state: "Rajasthan", postOffice: "Udaipur GPO" },
  144001: { city: "Jalandhar", state: "Punjab", postOffice: "Jalandhar GPO" },
  141001: { city: "Ludhiana", state: "Punjab", postOffice: "Ludhiana GPO" },
  160001: {
    city: "Chandigarh",
    state: "Chandigarh",
    postOffice: "Chandigarh GPO",
  },
  132001: { city: "Karnal", state: "Haryana", postOffice: "Karnal GPO" },
  250001: { city: "Meerut", state: "Uttar Pradesh", postOffice: "Meerut GPO" },
  282001: { city: "Agra", state: "Uttar Pradesh", postOffice: "Agra GPO" },
  221001: {
    city: "Varanasi",
    state: "Uttar Pradesh",
    postOffice: "Varanasi GPO",
  },
  211001: {
    city: "Prayagraj",
    state: "Uttar Pradesh",
    postOffice: "Allahabad GPO",
  },
  342001: { city: "Jodhpur", state: "Rajasthan", postOffice: "Jodhpur GPO" },
  324001: { city: "Kota", state: "Rajasthan", postOffice: "Kota GPO" },
  305001: { city: "Ajmer", state: "Rajasthan", postOffice: "Ajmer GPO" },
  364001: { city: "Bhavnagar", state: "Gujarat", postOffice: "Bhavnagar GPO" },
  390001: { city: "Vadodara", state: "Gujarat", postOffice: "Vadodara GPO" },
  360001: { city: "Rajkot", state: "Gujarat", postOffice: "Rajkot GPO" },
  416001: {
    city: "Kolhapur",
    state: "Maharashtra",
    postOffice: "Kolhapur GPO",
  },
  431001: {
    city: "Aurangabad",
    state: "Maharashtra",
    postOffice: "Aurangabad GPO",
  },
  425001: { city: "Jalgaon", state: "Maharashtra", postOffice: "Jalgaon GPO" },
  570001: { city: "Mysuru", state: "Karnataka", postOffice: "Mysore GPO" },
  580001: { city: "Hubli", state: "Karnataka", postOffice: "Hubli GPO" },
  575001: {
    city: "Mangaluru",
    state: "Karnataka",
    postOffice: "Mangalore GPO",
  },
  695001: {
    city: "Thiruvananthapuram",
    state: "Kerala",
    postOffice: "TVM GPO",
  },
  673001: { city: "Kozhikode", state: "Kerala", postOffice: "Calicut GPO" },
  678001: { city: "Palakkad", state: "Kerala", postOffice: "Palakkad GPO" },
  636001: { city: "Salem", state: "Tamil Nadu", postOffice: "Salem GPO" },
  620001: {
    city: "Tiruchirappalli",
    state: "Tamil Nadu",
    postOffice: "Trichy GPO",
  },
  612001: {
    city: "Thanjavur",
    state: "Tamil Nadu",
    postOffice: "Thanjavur GPO",
  },
  533001: {
    city: "Rajahmundry",
    state: "Andhra Pradesh",
    postOffice: "Rajahmundry GPO",
  },
  520001: {
    city: "Vijayawada",
    state: "Andhra Pradesh",
    postOffice: "Vijayawada GPO",
  },
  516001: {
    city: "Kurnool",
    state: "Andhra Pradesh",
    postOffice: "Kurnool GPO",
  },
  506001: { city: "Warangal", state: "Telangana", postOffice: "Warangal GPO" },
  504001: { city: "Adilabad", state: "Telangana", postOffice: "Adilabad GPO" },
  744101: {
    city: "Port Blair",
    state: "Andaman & Nicobar Islands",
    postOffice: "Port Blair GPO",
  },
  737101: { city: "Gangtok", state: "Sikkim", postOffice: "Gangtok GPO" },
  799001: { city: "Agartala", state: "Tripura", postOffice: "Agartala GPO" },
  793001: { city: "Shillong", state: "Meghalaya", postOffice: "Shillong GPO" },
  795001: { city: "Imphal", state: "Manipur", postOffice: "Imphal GPO" },
  797001: { city: "Kohima", state: "Nagaland", postOffice: "Kohima GPO" },
  796001: { city: "Aizawl", state: "Mizoram", postOffice: "Aizawl GPO" },
  791001: {
    city: "Itanagar",
    state: "Arunachal Pradesh",
    postOffice: "Itanagar GPO",
  },
  110044: { city: "New Delhi", state: "Delhi", postOffice: "Badarpur" },
  110059: { city: "New Delhi", state: "Delhi", postOffice: "Janakpuri" },
  110085: { city: "New Delhi", state: "Delhi", postOffice: "Rohini" },
};

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman & Nicobar Islands",
  "Chandigarh",
  "Dadra & Nagar Haveli",
  "Daman & Diu",
  "Delhi",
  "Jammu & Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

const Step4Address = () => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const [pinLoading, setPinLoading] = useState(false);
  const [pinError, setPinError] = useState("");
  const [pinMismatch, setPinMismatch] = useState("");

  const pincode = watch("pincode");
  const residenceType = watch("residenceType");
  const yearsAtAddress = watch("yearsAtAddress");
  const sameAsPermanent = watch("sameAsPermanent");
  const currentAddressLine1 = watch("currentAddressLine1");
  const currentAddressLine2 = watch("currentAddressLine2");
  const city = watch("city");
  const state = watch("state");

  // PIN code auto lookup — PDF Section A3.3
  useEffect(() => {
    if (!pincode || pincode.length !== 6) {
      setPinError("");
      setPinMismatch("");
      return;
    }

    const doLookup = async () => {
      setPinLoading(true);
      setPinError("");
      setPinMismatch("");

      // Simulate API delay
      await new Promise((res) => setTimeout(res, 800));

      const data = PIN_CODE_DATA[Number(pincode)];
      if (data) {
        const currentState = watch("state");

        // State mismatch warning — PDF Section A3.3
        if (currentState && currentState !== data.state) {
          setPinMismatch(
            `⚠️ PIN ${pincode} belongs to ${data.state}, not ${currentState}. State updated automatically.`,
          );
        }

        setValue("city", data.city);
        setValue("state", data.state);
        setValue("postOffice", data.postOffice);
      } else {
        setPinError(
          "PIN code not found. Please enter city and state manually.",
        );
        setValue("city", "");
        setValue("state", "");
        setValue("postOffice", "");
      }

      setPinLoading(false);
    };

    doLookup();
  }, [pincode]);

  // Same as permanent — copy values — PDF Section B2.1
  useEffect(() => {
    if (sameAsPermanent) {
      setValue("permanentAddressLine1", currentAddressLine1 || "", {
        shouldValidate: true,
      });
      setValue("permanentAddressLine2", currentAddressLine2 || "", {
        shouldValidate: true,
      });
      setValue("permanentCity", city || "", { shouldValidate: true });
      setValue("permanentState", state || "", { shouldValidate: true });
      setValue("permanentPincode", pincode || "", { shouldValidate: true });
    }
  }, [
    sameAsPermanent,
    currentAddressLine1,
    currentAddressLine2,
    city,
    state,
    pincode,
    setValue,
  ]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">
          Address Information
        </h2>
        <p className="text-slate-500 mt-1">
          Please provide your current residential address.
        </p>
      </div>

      {/* ── CURRENT ADDRESS ── */}
      <div className="p-5 border border-slate-200 rounded-2xl space-y-4">
        <h3 className="font-semibold text-slate-700 text-base">
          Current Address
        </h3>

        {/* Address Line 1 */}
        <div>
          <label
            htmlFor="currentAddressLine1"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Address Line 1 <span className="text-red-500">*</span>
          </label>
          <input
            id="currentAddressLine1"
            type="text"
            {...register("currentAddressLine1")}
            placeholder="House/Flat No., Building Name"
            className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          {errors.currentAddressLine1 && (
            <p
              role="alert"
              aria-live="polite"
              className="text-red-500 text-sm mt-1"
            >
              {errors.currentAddressLine1.message}
            </p>
          )}
        </div>

        {/* Address Line 2 */}
        <div>
          <label
            htmlFor="currentAddressLine2"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Address Line 2{" "}
            <span className="text-slate-400 text-xs">(Optional)</span>
          </label>
          <input
            id="currentAddressLine2"
            type="text"
            {...register("currentAddressLine2")}
            placeholder="Street, Area, Landmark"
            className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {/* PIN + City + State */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* PIN Code */}
          <div>
            <label
              htmlFor="pincode"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              PIN Code <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="pincode"
                type="text"
                {...register("pincode")}
                placeholder="6-digit PIN"
                maxLength={6}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              {pinLoading && (
                <span className="absolute right-3 top-3.5 text-xs text-indigo-500 animate-pulse">
                  Looking up...
                </span>
              )}
            </div>
            {pinError && (
              <p className="text-red-500 text-xs mt-1">{pinError}</p>
            )}
            {pinMismatch && (
              <p className="text-amber-600 text-xs mt-1">{pinMismatch}</p>
            )}
            {errors.pincode && (
              <p
                role="alert"
                aria-live="polite"
                className="text-red-500 text-sm mt-1"
              >
                {errors.pincode.message}
              </p>
            )}
          </div>

          {/* City — auto filled */}
          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              City <span className="text-red-500">*</span>
            </label>
            <input
              id="city"
              type="text"
              {...register("city")}
              placeholder="Auto-filled from PIN"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            {errors.city && (
              <p
                role="alert"
                aria-live="polite"
                className="text-red-500 text-sm mt-1"
              >
                {errors.city.message}
              </p>
            )}
          </div>

          {/* State — auto filled editable */}
          <div>
            <label
              htmlFor="state"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              State <span className="text-red-500">*</span>
            </label>
            <select
              id="state"
              {...register("state")}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">Select State</option>
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {errors.state && (
              <p
                role="alert"
                aria-live="polite"
                className="text-red-500 text-sm mt-1"
              >
                {errors.state.message}
              </p>
            )}
          </div>
        </div>

        {/* Post Office info */}
        {watch("postOffice") && (
          <p className="text-indigo-600 text-sm">
            📮 Post Office: <strong>{watch("postOffice")}</strong>
          </p>
        )}
      </div>

      {/* ── RESIDENCE TYPE — PDF Section B2.1 ── */}
      <div>
        <label
          htmlFor="residenceType"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Residence Type <span className="text-red-500">*</span>
        </label>
        <select
          id="residenceType"
          {...register("residenceType")}
          className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="">Select Residence Type</option>
          <option value="owned">Owned</option>
          <option value="rented">Rented</option>
          <option value="company">Company Provided</option>
          <option value="family">Family Owned</option>
        </select>
        {errors.residenceType && (
          <p
            role="alert"
            aria-live="polite"
            className="text-red-500 text-sm mt-1"
          >
            {errors.residenceType.message}
          </p>
        )}
      </div>

      {/* Rent Amount — only if Rented */}
      {residenceType === "rented" && (
        <div>
          <label
            htmlFor="rentAmount"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Monthly Rent (₹) <span className="text-red-500">*</span>
          </label>
          <input
            id="rentAmount"
            type="number"
            {...register("rentAmount", { valueAsNumber: true })}
            placeholder="e.g., 15000"
            className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          {errors.rentAmount && (
            <p
              role="alert"
              aria-live="polite"
              className="text-red-500 text-sm mt-1"
            >
              {errors.rentAmount.message}
            </p>
          )}
        </div>
      )}

      {/* Years at Address */}
      <div>
        <label
          htmlFor="yearsAtAddress"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Years at Current Address <span className="text-red-500">*</span>
        </label>
        <input
          id="yearsAtAddress"
          type="number"
          {...register("yearsAtAddress", { valueAsNumber: true })}
          placeholder="e.g., 3"
          min={0}
          max={50}
          className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        {errors.yearsAtAddress && (
          <p
            role="alert"
            aria-live="polite"
            className="text-red-500 text-sm mt-1"
          >
            {errors.yearsAtAddress.message}
          </p>
        )}
      </div>

      {/* Previous Address — show if < 1 year */}
      {Number(yearsAtAddress) < 1 &&
        yearsAtAddress !== "" &&
        !isNaN(yearsAtAddress) && (
          <div className="p-5 border border-amber-200 bg-amber-50 rounded-2xl space-y-4">
            <h3 className="font-semibold text-amber-800">
              Previous Address <span className="text-red-500">*</span>
            </h3>
            <p className="text-amber-700 text-sm">
              Since you have lived here less than 1 year, please provide your
              previous address.
            </p>

            <div>
              <label
                htmlFor="prevAddressLine1"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Address Line 1 <span className="text-red-500">*</span>
              </label>
              <input
                id="prevAddressLine1"
                type="text"
                {...register("prevAddressLine1")}
                placeholder="Previous address"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              {errors.prevAddressLine1 && (
                <p
                  role="alert"
                  aria-live="polite"
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.prevAddressLine1.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="prevCity"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  City
                </label>
                <input
                  id="prevCity"
                  type="text"
                  {...register("prevCity")}
                  placeholder="City"
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div>
                <label
                  htmlFor="prevState"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  State
                </label>
                <select
                  id="prevState"
                  {...register("prevState")}
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="">Select State</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="prevPincode"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  PIN Code
                </label>
                <input
                  id="prevPincode"
                  type="text"
                  {...register("prevPincode")}
                  placeholder="6-digit PIN"
                  maxLength={6}
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            </div>
          </div>
        )}

      {/* Same as Permanent checkbox */}
      <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
        <input
          id="sameAsPermanent"
          type="checkbox"
          {...register("sameAsPermanent")}
          className="w-4 h-4 accent-indigo-600"
        />
        <label
          htmlFor="sameAsPermanent"
          className="text-sm text-slate-700 cursor-pointer"
        >
          My permanent address is same as current address
        </label>
      </div>

      {/* Permanent Address — show if NOT same */}
      {!sameAsPermanent && (
        <div className="p-5 border border-slate-200 rounded-2xl space-y-4">
          <h3 className="font-semibold text-slate-700">
            Permanent Address <span className="text-red-500">*</span>
          </h3>

          <div>
            <label
              htmlFor="permanentAddressLine1"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Address Line 1 <span className="text-red-500">*</span>
            </label>
            <input
              id="permanentAddressLine1"
              type="text"
              {...register("permanentAddressLine1")}
              placeholder="House/Flat No., Building Name"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            {errors.permanentAddressLine1 && (
              <p
                role="alert"
                aria-live="polite"
                className="text-red-500 text-sm mt-1"
              >
                {errors.permanentAddressLine1.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="permanentAddressLine2"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Address Line 2{" "}
              <span className="text-slate-400 text-xs">(Optional)</span>
            </label>
            <input
              id="permanentAddressLine2"
              type="text"
              {...register("permanentAddressLine2")}
              placeholder="Street, Area, Landmark"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="permanentCity"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                City <span className="text-red-500">*</span>
              </label>
              <input
                id="permanentCity"
                type="text"
                {...register("permanentCity")}
                placeholder="City"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              {errors.permanentCity && (
                <p
                  role="alert"
                  aria-live="polite"
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.permanentCity.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="permanentState"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                State <span className="text-red-500">*</span>
              </label>
              <select
                id="permanentState"
                {...register("permanentState")}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="">Select State</option>
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {errors.permanentState && (
                <p
                  role="alert"
                  aria-live="polite"
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.permanentState.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="permanentPincode"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                PIN Code <span className="text-red-500">*</span>
              </label>
              <input
                id="permanentPincode"
                type="text"
                {...register("permanentPincode")}
                placeholder="6-digit PIN"
                maxLength={6}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              {errors.permanentPincode && (
                <p
                  role="alert"
                  aria-live="polite"
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.permanentPincode.message}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step4Address;
