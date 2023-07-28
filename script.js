let options = [];
let criteria = [];
let criteriaCount = 0;

function submitOptions() {
    let numOptions = document.getElementById("numOptions").value;
    if (numOptions == '') {
        document.getElementById('optionsError').textContent = 'Lütfen bir sayı giriniz.';
        return;
    }
    let optionsNames = document.getElementById('optionsNames');
    optionsNames.innerHTML = ''; // Reset the input fields

    for (let i = 0; i < numOptions; i++) {
        let div = document.createElement('div');
        div.id = `optionDiv${i}`;
        optionsNames.appendChild(div);
        optionsNames.placeholder = 'Flörtlerinizin adını girin.'
        div.style.marginRight = "20px";

        let input = document.createElement('input');
        input.id = `option${i}`;
        input.className = "optionInput";
        input.placeholder = 'Flörtlerinizin adını girin.'
        div.appendChild(input);

        optionsNames.appendChild(document.createElement('br'));
    }
    let button = document.createElement('button');
    button.innerText = 'Devam Et';
    button.onclick = collectOptionNames;
    optionsNames.appendChild(button);
}

function collectOptionNames() {
    let numOptions = document.getElementById("numOptions").value;
    options = []; // Clear previous options
    for (let i = 0; i < numOptions; i++) {
        let option = document.getElementById(`option${i}`).value;
        if (option == '') {
            // Display an error message and stop the function
            // errorDiv could be a div you add to display the error
            document.getElementById('optionsError').textContent = 'Lütfen tüm alanları doldurunuz.';
            options = [];
            return;
        }
        options.push(option);
    }
    document.querySelector('.options').style.opacity = '0';
    setTimeout(() => { document.querySelector('.options').style.display = 'none'; }, 500);
    document.querySelector('.criteria').style.display = 'block';
    setTimeout(() => { document.querySelector('.criteria').style.opacity = '1'; }, 0);
}

function submitCriteria() {
    document.getElementById('scoresInput').innerHTML = ''; // Eski input alanlarını ve etiketleri temizle
    let numCriteria = document.getElementById("numCriteria").value;
    criteriaCount = numCriteria;
    let criteriaNames = document.getElementById('criteriaNames');
    criteriaNames.innerHTML = ''; // Reset the input fields
    for (let i = 0; i < numCriteria; i++) {
        let div = document.createElement('div');
        div.id = `criteriaDiv${i}`;
        criteriaNames.appendChild(div);

        let inputName = document.createElement('input');
        inputName.placeholder = "Kriter Adı";
        inputName.id = `criteriaName${i}`;
        inputName.className = "criteriaInput"; 
        div.appendChild(inputName);

        let inputWeight = document.createElement('input');
        inputWeight.placeholder = "Bu kriter sizin için yüzde kaç önemli?";
        inputWeight.id = `criteriaWeight${i}`;
        inputWeight.className = "criteriaInput"; 
        div.appendChild(inputWeight);

        criteriaNames.appendChild(document.createElement('br'));
    }
    let button = document.createElement('button');
    button.innerText = 'Devam Et';
    button.onclick = collectCriteriaNames;
    criteriaNames.appendChild(button);
}

function collectCriteriaNames() {
    criteria = [];
    let totalWeight = 0;
    for (let i = 0; i < criteriaCount; i++) {
        let criteriaName = document.getElementById(`criteriaName${i}`).value;
        let criteriaWeight = document.getElementById(`criteriaWeight${i}`).value;
        totalWeight += parseInt(criteriaWeight);
        if (criteriaName == '' || criteriaWeight == '') {
            document.getElementById('criteriaError').textContent = 'Lütfen tüm alanları doldurunuz.';
            criteria = [];
            return;
        }
        criteria.push({name: criteriaName, weight: parseInt(criteriaWeight)});
    }
    if (totalWeight !== 100) {
        document.getElementById('criteriaError').textContent = 'Kriterlerin toplam ağırlığı 100 olmalıdır. Lütfen değerleri düzeltiniz.';
        criteria = [];
        return;
    }
    document.getElementById('criteriaError').textContent = '';
    document.querySelector('.criteria').style.display = 'none';
    document.querySelector('.scores').style.display = 'block';
    for (let i = 0; i < options.length; i++) {
        for (let j = 0; j < criteria.length; j++) {
            let label = document.createElement('label');
            label.textContent = `${options[i]} adayının ${criteria[j].name} özelliğine kaç puan verirsiniz? (1-10): `;
            let input = document.createElement('input');
            input.type = 'number';
            input.min = 1;
            input.max = 10;
            input.id = `score${i}${j}`;
            document.getElementById('scoresInput').appendChild(label);
            document.getElementById('scoresInput').appendChild(input);
            document.getElementById('scoresInput').appendChild(document.createElement('br'));
        }
    }
    document.getElementById('score00').focus();
}

function calculateScores() {
    document.getElementById('resultTable').innerHTML = '';
    let scores = [];
    for (let i = 0; i < options.length; i++) {
        scores[i] = 0;

        for (let j = 0; j < criteria.length; j++) {
            let score = document.getElementById(`score${i}${j}`).value;
            if (score == '') {
                document.getElementById('scoresError').textContent = 'Lütfen tüm alanları doldurunuz.';
                return;
            }
            if (score < 1 || score > 10) {
                document.getElementById('scoresError').textContent = 'Puanlar 1-10 arasında olmalıdır. Lütfen değerleri düzeltiniz.';
                return;
            }
            scores[i] += score * criteria[j].weight / 10;
        }
    }
    let totalScore = 0;
    for (let i = 0; i < scores.length; i++) {
        totalScore += scores[i];
    }
    let percentageScores = scores.map(score => (score / totalScore * 100).toFixed(2));
    let maxScore = Math.max(...scores);
    let bestOption = options[scores.indexOf(maxScore)];
    document.querySelector('.scores').style.display = 'none';
    document.querySelector('.result').style.display = 'block';
    document.getElementById('resultText').innerText = `En iyi seçenek: ${bestOption}`;

    for (let i = 0; i < options.length; i++) {
        let row = document.createElement('tr');
        let optionCell = document.createElement('td');
        let scoreCell = document.createElement('td');
        optionCell.textContent = options[i];
        scoreCell.textContent = `${percentageScores[i]}%`;
        row.appendChild(optionCell);
        row.appendChild(scoreCell);
        document.getElementById('resultTable').appendChild(row);
    }
    disableInputs();
}

function disableInputs() {
    let inputs = document.getElementsByTagName('input');
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].disabled = true;
    }
    document.getElementById('calculateButton').style.display = 'none';
    document.getElementById('editButton').style.display = 'block';
}

function enableInputs() {
    document.getElementById('scoresInput').innerHTML = '';
    let inputs = document.getElementsByTagName('input');
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].disabled = false;
    }
    document.getElementById('editButton').style.display = 'none';
    document.getElementById('calculateButton').style.display = 'block';
    document.querySelector('.options').style.display = 'block';
    document.querySelector('.criteria').style.display = 'none';
    document.querySelector('.options').style.opacity = '1';
    document.querySelector('.criteria').style.opacity = '1';
}

function resetOptions() {
    options = [];
    document.getElementById("numOptions").value = '';
    document.getElementById('optionsNames').innerHTML = '';
    document.getElementById('optionsError').textContent = '';
}

function resetCriteria() {
    criteria = [];
    criteriaCount = 0;
    document.getElementById("numCriteria").value = '';
    document.getElementById('criteriaNames').innerHTML = '';
    document.getElementById('criteriaError').textContent = '';
}

function resetScores() {
    document.getElementById('scoresInput').innerHTML = '';
    document.getElementById('scoresError').textContent = '';
}

function backFromOptions() {
    resetOptions();
    document.querySelector('.options').style.display = 'none';
    // Eğer options adımından geri döndüğümüzde gösterilmesini istediğiniz bir adım varsa, burada görünür hale getirebilirsiniz.
}

function backFromCriteria() {
    resetCriteria();
    document.querySelector('.criteria').style.display = 'none';
    document.querySelector('.options').style.display = 'block';
    setTimeout(() => { document.querySelector('.options').style.opacity = '1'; }, 0);
}

function backFromScores() {
    resetScores();
    document.querySelector('.scores').style.display = 'none';
    document.querySelector('.criteria').style.display = 'block';
    setTimeout(() => { document.querySelector('.criteria').style.opacity = '1'; }, 0);
}


