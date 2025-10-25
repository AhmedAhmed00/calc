// Constants
const totalMonthlyHours = 176;
const workDaysPerWeek = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday"];

// Function to calculate working days in a given month
function getWorkingDaysInMonth(year, month) {
  let date = new Date(year, month, 1);
  let count = 0;
  while (date.getMonth() === month) {
    const dayName = date.toLocaleString("en-US", { weekday: "long" });
    if (workDaysPerWeek.includes(dayName)) count++;
    date.setDate(date.getDate() + 1);
  }
  return count;
}

// Main calculation function
function calculateWorkData(hoursWorked, salary) {
  const hourlySalary = salary / totalMonthlyHours;
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const currentDay = today.getDate();

  const totalWorkingDays = getWorkingDaysInMonth(year, month);

  let passedWorkingDays = 0;
  for (let day = 1; day <= currentDay; day++) {
    const date = new Date(year, month, day);
    const dayName = date.toLocaleString("en-US", { weekday: "long" });
    if (workDaysPerWeek.includes(dayName)) passedWorkingDays++;
  }

  const remainingWorkingDays = totalWorkingDays - passedWorkingDays;
  const dailyWorkHours = totalMonthlyHours / totalWorkingDays;
  const expectedHoursUntilToday = passedWorkingDays * dailyWorkHours;
  const hourDifference = hoursWorked - expectedHoursUntilToday;
  const remainingHours = totalMonthlyHours - hoursWorked;

  const earnedMoney = Math.min(hoursWorked, totalMonthlyHours) * hourlySalary;
  const missingHours = remainingHours < 0 ? 0 : remainingHours;
  const deduction = missingHours * 2 * hourlySalary;
  const netSalary = salary - deduction;

  const completionPercentage = (hoursWorked / totalMonthlyHours) * 100;
  const monthProgressPercentage = (passedWorkingDays / totalWorkingDays) * 100;

  return {
    hoursWorked,
    expectedHoursUntilToday,
    hourDifference,
    remainingHours,
    passedWorkingDays,
    remainingWorkingDays,
    earnedMoney,
    deduction,
    netSalary,
    completionPercentage,
    monthProgressPercentage,
  };
}

// Event listener for button
document.getElementById("calculateBtn").addEventListener("click", () => {
  const hoursInput = parseFloat(document.getElementById("hoursInput").value);
  const salaryInput = parseFloat(document.getElementById("salaryInput").value);
  const resultDiv = document.getElementById("result");

  if (isNaN(hoursInput) || hoursInput < 0) {
    resultDiv.innerHTML = "❌ Please enter a valid number of hours.";
    resultDiv.classList.remove("hidden");
    return;
  }

  if (isNaN(salaryInput) || salaryInput <= 0) {
    resultDiv.innerHTML = "❌ Please enter a valid salary amount.";
    resultDiv.classList.remove("hidden");
    return;
  }

  const result = calculateWorkData(hoursInput, salaryInput);

  resultDiv.innerHTML = `
    ✅ <strong>Total hours worked:</strong> ${result.hoursWorked.toFixed(2)} hrs<br>
    📈 <strong>Expected hours until today:</strong> ${result.expectedHoursUntilToday.toFixed(2)} hrs<br>
    ${
      result.hourDifference >= 0
        ? `🟢 <strong>You are ${result.hourDifference.toFixed(2)} hours ahead of schedule</strong><br>`
        : `🔴 <strong>You are ${Math.abs(result.hourDifference).toFixed(2)} hours behind schedule</strong><br>`
    }
    ⏳ <strong>Remaining hours this month:</strong> ${result.remainingHours.toFixed(2)} hrs<br>
    📅 <strong>Workdays passed:</strong> ${result.passedWorkingDays}<br>
    📆 <strong>Workdays remaining:</strong> ${result.remainingWorkingDays}<br>
    📊 <strong>Month progress (workdays):</strong> ${result.monthProgressPercentage.toFixed(1)}%<br>
    ⚙️ <strong>Work progress (hours):</strong> ${result.completionPercentage.toFixed(1)}%<br>
    💰 <strong>Earned so far:</strong> ${result.earnedMoney.toFixed(2)} EGP<br>
    ❌ <strong>Deduction:</strong> ${result.deduction.toFixed(2)} EGP<br>
    🧾 <strong>Net salary so far:</strong> ${result.netSalary.toFixed(2)} EGP
  `;
  resultDiv.classList.remove("hidden");
});
