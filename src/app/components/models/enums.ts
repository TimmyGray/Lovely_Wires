enum Corenumber {
  one_ground,
  two_ground,
  three_ground,
  four_ground,
  five_ground,
  four_by_two_ground,
  eight_by_two_ground,

}

export let Corenumbers: string[] = new Array<string>();

for (let i = 0; ; i++) {

  const corenumber: string = Corenumber[i];
  if (corenumber == null || corenumber == "" || corenumber == undefined) {
    break;
  }

  Corenumbers.push(corenumber);

}

export enum ConnectorType {

  trs_m,
  ts_m,
  xlr_m,
  rca_m,
  trs_f,
  ts_f,
  xlr_f,
  rca_f,
  bnc

}

export let Connectors: string[] = new Array<string>();


for (let i = 0; ; i++) {

  let connector: string = ConnectorType[i];
  if (connector == null || connector == "" || connector == undefined) {
    break;
  }

  Connectors.push(connector);


}

enum WireType {

  audio,
  video

}

export let Wiretypes: string[] = new Array<string>();

for (let i = 0; ; i++) {

  const wiretype: string = WireType[i];

  if (wiretype == null || wiretype == "" || wiretype == undefined) {
    break;
  }

  Wiretypes.push(wiretype);


}


export enum OrderStatus {

  under_consideration,
  agree,
  done,
  canceled

}

export let statuses: string[] = new Array<string>();

for (var i = 0; ;i++) {

  const status: string = OrderStatus[i];

  if (status == null || status == "" || status == undefined) {
    break;
  }

  statuses.push(status);

}
