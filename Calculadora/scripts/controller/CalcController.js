class calcController {

    constructor(){

        this._audio = new Audio('click.mp3');
        this._audioOnOff = false;
        this.lastOperator = '';
        this._lastNumber ='';

        this._operator = [];
        this._location = 'pt-BR';

        // Variáveis DOM do display (data hora e resultado)

        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this._currentDate;

        this.inicialize();
        //Inicializando as configurações dos eventos-Botões 
        this.initButtonsEvent();
        this.initKeyboard();
    }

    // Copiar para area de transferencia,  ctrl c
    copyToClipBoard(){

        let input = document.createElement('input');

        input.value = this.displayCalc;

        document.body.appendChild(input);

        input.select();

        document.execCommand("Copy");

        input.remove();
    }

    // Copiar da area de transferencia ,  ctrl v
    pasteFromClipBoard(){

        document.addEventListener('paste', e => {

            let text = e.clipboardData.getData('Text');

            this.displayCalc = parseFloat(text);
        })
    }

    inicialize(){

       this.setDisplayDateTime();

        setInterval(() => {
            this.setDisplayDateTime();
            
        }, 1000);

        this.setLastNumberToDisplay();
        this.pasteFromClipBoard();

        document.querySelectorAll('.btn-ac').forEach(btn => {

            btn.addEventListener('dblclick', e  => {

                this.toggleAudio();
            });

        });

    }   

    toggleAudio(){
        
        // forma resumida de falar q o audio é diferente do outro, se um é falso o outro é verdadeiro
        this._audioOnOff = !this._audioOnOff;

    }

    playAudio(){

        if(this._audioOnOff){

            this._audio.currentTime = 0;
            this._audio.play();

        }
    }

    initKeyboard(){
        document.addEventListener('keyup', e =>{

            this.playAudio();
        
            switch (e.key) {
                case 'Escape':
                    this.Allclear();    
                break;
    
                case 'Backspace':   
                    this.clearEntry();   
                break;
    
                case '+':
                case '-':
                case '*':
                case '/':
                case '%':
                    this.addOperator(e.key);
                break;
    
                case 'Enter':
                case '=':
                    this.calc();
                break;
    
                case '.':
                case ',':    
                    this.addDot();
                break;           
    
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperator(parseInt(e.key));
                break;

                case 'c':
                    if(e.ctrlKey) this.copyToClipBoard();
                break;     
            }
        });
    }

    // Métodos de Controle Button
    
    //Metodo para adicionar os eventos de cada classe (existe dos elementos "iguais", por conta disso precisa adicionar um de cada vez).

    addEventListenerAll(element , events , fn ){
       // split cortando a string em um ponto determinado no ('')
        events.split(' ').forEach(event => {

            element.addEventListener( event , fn , false);
        })
    }

    Allclear(){

        this._operator = [];
        this._lastNumber = '';
        this.lastOperator = '';
        this.setLastNumberToDisplay();
    }

    clearEntry(){

        this._operator.pop();// Excluindo o ultimo dado do array 
        this.setLastNumberToDisplay();
    }

    isOperator(value){

       // indexOf = faz uma pesquisa dentro do array e se tiver ele retorna o resultado 
       return (['+','-' ,'%' , '*' , '/'].indexOf(value) > -1);

    }
    pushOperator(value){

        this._operator.push(value); // enviando uma nova index no array(como o ultimo dado)

        if(this._operator.length > 3){
            this.calc();
        }
    }

    getResult(){
        //try é para tentar fazer o codigo acontecer
        try{
        // eval = pega a string e transforma em comando
        return eval(this._operator.join("")); // join = serve para adicionar no separador
        }
        // o catch é para se ele não executar o try faz automatico o comando do catch 
        catch(e){
            setTimeout(()=>{
                this.setError();
            }, 1);
        }
    }

    calc(){
        
        let last = '';
        this.lastOperator = this.getLastItem();

        if(this._operator.length < 3){

            let firstItem = this._operator[0];
            this._operator = [firstItem , this.lastOperator , this._lastNumber];

        }

        if(this._operator.length > 3){

            last = this._operator.pop();

            this._lastNumber = this.getResult();

        }

        else if(this._operator.length == 3){

            this._lastNumber = this.getLastItem(false);

        }

        let result = this.getResult();

        if(last == '%'){

            result /= 100;

            this._operator = [result];

        }
        else{
            
            this._operator = [result];

            if(last) this._operator.push(last);

        }

        this.setLastNumberToDisplay();
    }

    getLastItem(isOperator = true){

        let lastNumber;

        for(let i = this._operator.length -1 ; i >= 0; i--){

            if(this.isOperator(this._operator[i]) == isOperator){

                lastNumber = this._operator[i];
                break;
            }
        }

        if (!lastNumber){

            lastNumber = (isOperator) ? this._lastOperator : this._lastNumber;
        }
        return lastNumber;  
    }

    setLastNumberToDisplay(){

        let lastNumber = this.getLastItem(false);
        if(!lastNumber) lastNumber =0;
        this.displayCalc = lastNumber;
    }

    setLastOperator(value){
        return this._operator[this._operator.length - 1] = value;
    }

    addOperator(value){

        if(isNaN( this.getLastItem())){

            if(this.isOperator(value)){

                this.setLastOperator(value);

            }else if(isNaN(value)){

                console.log(value);

            }else{
                this.pushOperator(value); // enviando uma nova index no array(como o ultimo dado)
                this.setLastNumberToDisplay();
            }

        }
        else{

            if(this.isOperator(value)){

                this.pushOperator(value); // enviando uma nova index no array(como o ultimo dado)
            }
            else{

                let newValue = this.getLastItem().toString() + value.toString();
                this.setLastOperator(newValue);

                //Atualizando display
                this.setLastNumberToDisplay();

            }
        }
    }

    getLastItem(){
       return  this._operator[this._operator.length -1];
    }

    setError(){
        this.displayCalc ='Error';
    }
    
    addDot(){

        let lastOperator = this.getLastItem();

        if(typeof lastOperator === 'string' && lastOperator.split('').indexOf('.') > -1) return;

        if(this.isOperator(lastOperator) || !lastOperator){

            this.pushOperator('0.');

        }
        else{
            this.setLastOperator(lastOperator.toString() + '.');
        }

        this.setLastNumberToDisplay();
    }

    // Tratamento de dados
    execBtn(value){

        this.playAudio();

        switch (value) {

        case 'ac':
            this.Allclear();
        break;

        case 'ce':
            this.clearEntry();
        break;

        case 'soma':
            this.addOperator('+');
        break;

        case 'subtracao':
            this.addOperator('-');
        break;

        case 'multiplicacao':
            this.addOperator('*');
        break;

        case 'divisao':
            this.addOperator('/');
        break;

        case 'porcento':
            this.addOperator('%');
        break;

        case 'igual':
            this.calc();
        break;

        case 'ponto':
            this.addDot();
        break;

        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
            this.addOperator(parseInt(value));
        break;

        default:
            this.setError();
        break;
            
        }
    }

    initButtonsEvent(){

        // Filtrando só os bottões do sgv.
       let buttons = document.querySelectorAll('#buttons > g , #parts > g')// Selecionando todo o conteúdo da documentação (DOM) com o ID > g(patrametro svg)

        buttons.forEach((btn , index)=>{ // lup de todos os itens encontrados no filtro do documento

        this.addEventListenerAll(btn , "click drag" , e =>{ 

            let textBtn = btn.className.baseVal.replace('btn-' , '')// excluíndo uma parte das class

            this.execBtn(textBtn); // tratamento do value liquido.
    
           });

           // Comando Cursor - Front-end 
           this.addEventListenerAll(btn ,'mouseover mouseup mousedown' , e =>{

            btn.style.cursor = 'pointer';
    
           });

      })
    }

    setDisplayDateTime(){

        this.displayTime = this.currentDate_currentDate.toLocaleTimeString(this._location);
        this.displayDate = this.currentDate_currentDate.toLocaleDateString(this._location);

    }

    // GET SET do sistema

    get displayDate(){
        return this._dateEl.innerHTML;
    }

    set displayDate (value){
        this._dateEl.innerHTML = value;
    }

    get displayTime(){
        return this._timeEl.innerHTML;
    }

    set displayTime(value){
        this._timeEl.innerHTML = value;
    }


    get displayCalc(){
        return this._displayCalcEl.innerHTML;
    }

    set displayCalc(value){

        // length é para string, entao o toString é para converter o valor em string 
        if(value.toString().length > 10){ 
            this.setError();
            return false;
        }
        this._displayCalcEl.innerHTML = value;
    }

    get currentDate_currentDate(){
        return new Date();
    }

    set currentDate_currentDate(value){
        this._currentDate = value;
    }
    
}