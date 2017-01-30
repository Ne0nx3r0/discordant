const vm = require('vm');

export default {
    runInContext(code,contextObj){
        const script = new vm.Script(code);

        return script.runInNewContext(contextObj);
    }
}