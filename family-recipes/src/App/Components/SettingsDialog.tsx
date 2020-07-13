import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

interface SettingsDialogProps{
  onCancel: ()=>void;
  onApply: ()=>void;
  open: boolean;
  title: string;
  className ?: string;
}
export default class SettingsDialog extends React.Component<SettingsDialogProps> {
  render(){
  return (
      <Dialog className={this.props.className} open={this.props.open} onClose={()=>this.props.onCancel()} scroll="paper">
        <DialogTitle id="scroll-dialog-title">{this.props.title}</DialogTitle>
        <DialogContent>
          {this.props.children}
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>this.props.onCancel()} color="secondary">
            Cancel
          </Button>
          <Button onClick={()=>this.props.onApply()} color="secondary">
            Apply
          </Button>
        </DialogActions>
      </Dialog>
  );
  }
}