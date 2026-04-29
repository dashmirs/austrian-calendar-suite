import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApp } from "@/contexts/AppContext";

interface Props {
  open: boolean;
  onOpenChange: (b: boolean) => void;
  defaultDate: string;
}

export function AppointmentDialog({ open, onOpenChange, defaultDate }: Props) {
  const { t, addAppointment } = useApp();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState("09:00");
  const [reminder, setReminder] = useState("15");

  useEffect(() => { setDate(defaultDate); }, [defaultDate]);
  useEffect(() => {
    if (!open) {
      setTitle(""); setDescription(""); setTime("09:00"); setReminder("15");
    }
  }, [open]);

  const submit = async () => {
    if (!title.trim()) return;
    await addAppointment({
      title: title.trim(),
      description: description.trim() || undefined,
      date,
      time,
      reminderMinutes: Number(reminder),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>{t("newAppointment")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label htmlFor="t">{t("title")}</Label>
            <Input id="t" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
          </div>
          <div>
            <Label htmlFor="d">{t("description")}</Label>
            <Textarea id="d" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="dt">{t("date")}</Label>
              <Input id="dt" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="tm">{t("time")}</Label>
              <Input id="tm" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
          </div>
          <div>
            <Label>{t("reminder")}</Label>
            <Select value={reminder} onValueChange={setReminder}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="0">{t("none")}</SelectItem>
                <SelectItem value="5">5 {t("reminderMinutes")}</SelectItem>
                <SelectItem value="15">15 {t("reminderMinutes")}</SelectItem>
                <SelectItem value="30">30 {t("reminderMinutes")}</SelectItem>
                <SelectItem value="60">60 {t("reminderMinutes")}</SelectItem>
                <SelectItem value="1440">1 Tag {t("reminderMinutes")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{t("cancel")}</Button>
          <Button onClick={submit}>{t("save")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
