enum Connector {
  trs_m,
  ts_m,
  xlr_m,
  rca_m,
  trs_f,
  ts_f,
  xlr_f,
  rca_f


}

export let Connectors: Array<string> = new Array<string>();


for (let i = 0; ; i++) {

  let connector: string = Connector[i];
  if (connector == null || connector == "" || connector == undefined) {
    break;
  }

  Connectors.push(connector);


}

