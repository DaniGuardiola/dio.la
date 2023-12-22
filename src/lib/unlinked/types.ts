export type UnlinkedPerson = {
  name: string;
  profession: string;
  yearsOfExperience?: number;
};

export type UnlinkedProfile = {
  person: UnlinkedPerson;
};
