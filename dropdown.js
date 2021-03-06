$(document).ready(function(){ //populates the college and major dropdowns
    load_json_data('college');
    function load_json_data(id, parent_id)
    {
        var html_code = '';
        $.getJSON('colleges.json', function(data){

            html_code += '<option value="">'+id+'</option>';
            $.each(data, function(key, value){
                if(id == 'college')
                {
                    if(value.parent_id == '0')
                    {
                        html_code += '<option value="'+value.id+'">'+value.name+'</option>';
                    }
                }
                else
                {
                    if(value.parent_id == parent_id)
                    {
                        html_code += '<option value="'+value.id+'">'+value.name+'</option>';
                    }
                }               
            });
            $('#'+id).html(html_code);
        });
    }

    $(document).on('change', '#college', function(){
        var college_id = $(this).val();
        if(college_id != '')
        {
            load_json_data('major', college_id);
        }
        else
        {
            $('#major').html('<option value="">Major</option>');
        }
    });
});

var id;
var highSchoolIncomeNum = 34900;
var highSchoolIncomeStr = '$34,900';
var avgEffectiveInterestRate = 0.058 / 12;
var avgLoanTerm = -120;

document.addEventListener('DOMContentLoaded', () => {
    document
      .getElementById('college')
      .addEventListener('input', handleSelectCollege);
    document
      .getElementById('major')
      .addEventListener('input', handleSelectMajor);
  });



function handleSelectCollege(ev) { //sets id to be used in the api call to the id of the college selected
    let collegeSelect = ev.target;
    let collegeChoice = [];
    collegeChoice = [].map.call(collegeSelect.selectedOptions, (option) => option.value);
    id = collegeChoice[0];

    fetch(`https://api.data.gov/ed/collegescorecard/v1/schools.json?id=${id}&fields=2013.earnings.6_yrs_after_entry.working_not_enrolled.earnings_percentile,2013.earnings.6_yrs_after_entry.median,2013.aid.cumulative_debt,2013.aid.median_debt.completers.overall&api_key=9AGx7OHmLxEOaxnbQpR4xC8RC4kNwpI43jG6vZz3`)
        .then(res => res.json())
        .then(dataCollege => {

    let collegeOutputString = JSON.stringify(dataCollege); //converts the json selection to a string
    //these removes the periods from json selection
    let collegeOutputReplaceString1 = collegeOutputString.replace(/"2013.earnings.6_yrs_after_entry.working_not_enrolled.earnings_percentile.25"/g, '"earnings_25"'); 
    let collegeOutputReplaceString2 = collegeOutputReplaceString1.replace(/"2013.earnings.6_yrs_after_entry.median"/g, '"earnings_median"');
    let collegeOutputReplaceString3 = collegeOutputReplaceString2.replace(/"2013.earnings.6_yrs_after_entry.working_not_enrolled.earnings_percentile.75"/g, '"earnings_75"');
    let collegeOutputReplaceString4 = collegeOutputReplaceString3.replace(/"2013.aid.cumulative_debt.25th_percentile"/g, '"debt_25"');
    let collegeOutputReplaceString5 = collegeOutputReplaceString4.replace(/"2013.aid.median_debt.completers.overall"/g, '"debt_median"');
    let collegeOutputReplaceString6 = collegeOutputReplaceString5.replace(/"2013.aid.cumulative_debt.75th_percentile"/g, '"debt_75"');
    let collegeJson = JSON.parse(collegeOutputReplaceString6); //converts the string back to a new json file
    
    //adds the general college earnings and debt information to the html file
    collegeJson.results.forEach((college) => salary25 = `${college.earnings_25}`)
    let salary25SubString1 = salary25.substring(0,2);
    let salary25SubString2 = salary25.substring(2,5);
    let updatedSalary25 = '$' + salary25SubString1 + ',' + salary25SubString2;
    document.querySelector('.salary25').textContent = `${updatedSalary25}`

    collegeJson.results.forEach((college) => salary75 = `${college.earnings_75}`)
    let salary75SubString1 = salary75.substring(0,2);
    let salary75SubString2 = salary75.substring(2,5);
    let updatedSalary75 = '$' + salary75SubString1 + ',' + salary75SubString2;
    document.querySelector('.salary75').textContent = `${updatedSalary75}`

    collegeJson.results.forEach((college) => medianSalary = `${college.earnings_median}`)
    let medianSalarySubString1 = medianSalary.substring(0,2);
    let medianSalarySubString2 = medianSalary.substring(2,5);
    let updatedMedianSalary = '$' + medianSalarySubString1 + ',' + medianSalarySubString2;
    document.querySelector('.salaryMedian').textContent = `${updatedMedianSalary}`

    collegeJson.results.forEach((college) => aid25 = `${college.debt_25}`)
    if (aid25.length === 5) {
        let aid25SubString1 = aid25.substring(0,2);
        let aid25SubString2 = aid25.substring(2,5);
        let updatedAid25 = '$' + aid25SubString1 + ',' + aid25SubString2;
        document.querySelector('.aid25').textContent = `${updatedAid25}`
    } else {
        let aid25SubString1 = aid25.substring(0,1);
        let aid25SubString2 = aid25.substring(1,4);
        let updatedAid25 = '$' + aid25SubString1 + ',' + aid25SubString2;
        document.querySelector('.aid25').textContent = `${updatedAid25}`
    }

    collegeJson.results.forEach((college) => aid75 = `${college.debt_75}`)
    let aid75SubString1 = aid75.substring(0,2);
    let aid75SubString2 = aid75.substring(2,5);
    let updatedAid75 = '$' + aid75SubString1 + ',' + aid75SubString2;
    document.querySelector('.aid75').textContent = `${updatedAid75}`

    collegeJson.results.forEach((college) => aidMedian = `${college.debt_median}`)
    let aidMedianSubString1 = aidMedian.substring(0,2);
    let aidMedianSubString2 = aidMedian.substring(2,5);
    let updatedAidMedian = '$' + aidMedianSubString1 + ',' + aidMedianSubString2;
    document.querySelector('.aidMedian').textContent = `${updatedAidMedian}`

    document.querySelector('.program-median').textContent = `${''}`
    });

    return id;
}



function handleSelectMajor(ev) { //sets code to be used in the api call to the code of the major selected
    let majorSelect = ev.target;
    majorChoice = [].map.call(majorSelect.selectedOptions, (option) => option.value);
    let code = majorChoice[0];

    //api call to create json file
    fetch(`https://api.data.gov/ed/collegescorecard/v1/schools.json?programs.cip_4_digit.code=${code}&id=${id}&programs.cip_4_digit.credential.level=3&fields=programs.cip_4_digit.earnings.highest.3_yr.overall_median_earnings&api_key=9AGx7OHmLxEOaxnbQpR4xC8RC4kNwpI43jG6vZz3`)
        .then(res => res.json())
        .then(dataMajor => {
            
    let majorOutputString = JSON.stringify(dataMajor); //converts the json selection to a string
    let majorOutputSubString1 = majorOutputString.substring(148,151); 
    let majorOutputSubString2 = majorOutputString.substring(151,154);
    let majorOutputReplaceSubString = majorOutputSubString2.replace('}', ''); //removes bracket
    if (majorOutputString.length === 162) {
        let majorOutputAppendString = '$' + majorOutputSubString1 + ',' + majorOutputReplaceSubString; //adds a dollar sign and comma
        document.querySelector('.program-median').textContent = `${majorOutputAppendString}` //adds the major median to the html file
    } else {
        let majorOutputSubString3 = majorOutputString.substring(148,150);
        let majorOutputSubString4 = majorOutputString.substring(150,151);
        let majorOutputAppendString = '$' + majorOutputSubString3 + ',' + majorOutputSubString4 + majorOutputReplaceSubString;
        document.querySelector('.program-median').textContent = `${majorOutputAppendString}` //adds the major median to the html file
    }
    
    let collegeAid1 = document.querySelector('.aidMedian').textContent;
    let collegeAid2 = collegeAid1.replace(',', '');
    let collegeAid3 = collegeAid2.replace('$', '');
    let collegeAid4 = (collegeAid3 * (avgEffectiveInterestRate / (1 - (1 + avgEffectiveInterestRate) ** (avgLoanTerm)))) * 120;

    let collegeIncomeInitial1 = majorOutputSubString1 + majorOutputReplaceSubString;
    let collegeIncomeInitial2 = collegeIncomeInitial1.replace('}', '');
    let collegeIncomeInitial3 = ((collegeIncomeInitial2 * 10) - collegeAid4) / 10;
    let collegeIncomeInitialRounded = Math.round(collegeIncomeInitial3);
    let collegeIncomeStr = collegeIncomeInitialRounded.toString();
    if (collegeIncomeStr.length === 6) {
        let collegeIncomeSubStr1 = collegeIncomeStr.substring(0,3);
        let collegeIncomeSubStr2 = collegeIncomeStr.substring(3,6);
        let collegeIncome = '$' + collegeIncomeSubStr1 + ',' + collegeIncomeSubStr2;
        document.querySelector('.college-income').textContent = `${collegeIncome}`
    } else {
        let collegeIncomeSubStr1 = collegeIncomeStr.substring(0,2);
        let collegeIncomeSubStr2 = collegeIncomeStr.substring(2,5);
        let collegeIncome = '$' + collegeIncomeSubStr1 + ',' + collegeIncomeSubStr2;
        document.querySelector('.college-income').textContent = `${collegeIncome}`
    }
    
    document.querySelector('.highschool-income').textContent = `${highSchoolIncomeStr}`

    let payDifferenceInitial = collegeIncomeInitial3 - highSchoolIncomeNum;
    let payDifferenceInitialRounded = Math.round(payDifferenceInitial);
    let payDifferenceStr = payDifferenceInitialRounded.toString();
    if (payDifferenceStr.length === 4 && payDifferenceInitialRounded > 0) {
        let payDifferenceSubStr1 = payDifferenceStr.substring(0,1);
        let payDifferenceSubStr2 = payDifferenceStr.substring(1,4);
        let payDifference = '$' + payDifferenceSubStr1 + ',' + payDifferenceSubStr2;
        document.querySelector('.income-difference').textContent = `${payDifference}`
    } else if (payDifferenceStr.length === 5 && payDifferenceInitialRounded > 0) {
        let payDifferenceSubStr1 = payDifferenceStr.substring(0,2);
        let payDifferenceSubStr2 = payDifferenceStr.substring(2,5);
        let payDifference = '$' + payDifferenceSubStr1 + ',' + payDifferenceSubStr2;
        document.querySelector('.income-difference').textContent = `${payDifference}`
    } else if (payDifferenceInitialRounded > 0) {
        let payDifferenceSubStr1 = payDifferenceStr.substring(0,3);
        let payDifferenceSubStr2 = payDifferenceStr.substring(3,6);
        let payDifference = '$' + payDifferenceSubStr1 + ',' + payDifferenceSubStr2;
        document.querySelector('.income-difference').textContent = `${payDifference}`
    } else if (payDifferenceStr.length === 5 && payDifferenceInitialRounded < 0) {
        let payDifferenceSubStr1 = payDifferenceStr.substring(1,2);
        let payDifferenceSubStr2 = payDifferenceStr.substring(2,5);
        let payDifference = '- $' + payDifferenceSubStr1 + ',' + payDifferenceSubStr2;
        document.querySelector('.income-difference').textContent = `${payDifference}`
    } else {
        let payDifferenceSubStr1 = payDifferenceStr.substring(1,3);
        let payDifferenceSubStr2 = payDifferenceStr.substring(3,6);
        let payDifference = '- $' + payDifferenceSubStr1 + ',' + payDifferenceSubStr2;
        document.querySelector('.income-difference').textContent = `${payDifference}`
    }

    if (collegeIncomeInitial3 > highSchoolIncomeNum) {
        document.querySelector('.doesCollegePay').textContent = 'YES!';
        document.getElementById('pay').style.color = 'green';
    } else {
        document.querySelector('.doesCollegePay').textContent = 'Unfortunately, no';
        document.getElementById('pay').style.color = 'red';
    }
    
    })
}

