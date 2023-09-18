class Ui {
  globalLoader = 0;

  showGlobalLoader(num = 1): void {
    this.globalLoader += num;
  }

  hideGlobalLoader(num = -1): void {
    this.globalLoader += num;
  }
}

export default Ui;
