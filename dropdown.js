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
    updatedSalary25 = '$' + salary25;
    document.querySelector('.salary25').textContent = `${updatedSalary25}`

    collegeJson.results.forEach((college) => salary75 = `${college.earnings_75}`)
    updatedSalary75 = '$' + salary75;
    document.querySelector('.salary75').textContent = `${updatedSalary75}`

    collegeJson.results.forEach((college) => medianSalary = `${college.earnings_median}`)
    updatedMedianSalary = '$' + medianSalary;
    document.querySelector('.salaryMedian').textContent = `${updatedMedianSalary}`

    collegeJson.results.forEach((college) => aid25 = `${college.debt_25}`)
    updatedAid25 = '$' + aid25;
    document.querySelector('.aid25').textContent = `${updatedAid25}`

    collegeJson.results.forEach((college) => aid75 = `${college.debt_75}`)
    updatedAid75 = '$' + aid75;
    document.querySelector('.aid75').textContent = `${updatedAid75}`

    collegeJson.results.forEach((college) => aidMedian = `${college.debt_median}`)
    updatedAidMedian = '$' + aidMedian;
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
    let majorOutputSubString1 = majorOutputString.substring(147,150); //cuts out the desired numbers from the string
    let majorOutputSubString2 = majorOutputString.substring(150,153);
    let majorOutputAppendString = '$' + majorOutputSubString1 + ',' + majorOutputSubString2; //adds a dollar sign and comma
    let majorOutputReplaceString = majorOutputAppendString.replace(':', '') //removes semicolons from 5 digit numbers
    document.querySelector('.program-median').textContent = `${majorOutputReplaceString}` //adds the major median to the html file
    })
}