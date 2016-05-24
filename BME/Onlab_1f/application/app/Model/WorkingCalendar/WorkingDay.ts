///<reference path='WorkingHour.ts'/>
///<reference path='../../Util/IntervalList/IntervalList.ts'/>

module Model.WorkingCalendar {
    import WorkingHour = Model.WorkingCalendar.WorkingHour;
    import IntervalList = Util.IntervalList.IntervalList;
    export class WorkingDay {
        workingHours: IntervalList<WorkingHour>;

        constructor() {
            this.workingHours = new IntervalList<WorkingHour>();
        }

		add(date: Date, remainingMinutes: number): number {
			var i: number = 0;
			this.workingHours.each(function(workingHour: WorkingHour): boolean {
				remainingMinutes = workingHour.add(date, remainingMinutes);
				return (remainingMinutes > 0);
			});
			return remainingMinutes;
		}

		subtract(date: Date, remainingMinutes: number): number {
			var i: number = 0;
			this.workingHours.reverse(function(workingHour: WorkingHour): boolean {
				remainingMinutes = workingHour.subtract(date, remainingMinutes);
				return (remainingMinutes > 0);
			});
			return remainingMinutes;
		}

		isEnd(date: Date, backward: boolean = false): boolean {
			if(!backward) {
				var lastWHour: WorkingHour = this.workingHours.last();
				return ((lastWHour.toHour == date.getHours() && lastWHour.toMinute <= date.getMinutes()) ||
					lastWHour.toHour < date.getHours());
			} else {
				var firstWHour: WorkingHour = this.workingHours.first();
				return ((firstWHour.fromHour == date.getHours() && firstWHour.fromMinute >= date.getMinutes()) ||
					firstWHour.fromHour > date.getHours());
			}
		}


        setTimeToPeriod(date: Date, backward: boolean = false) {
			if(backward) {
				this.setTimeToPeriodBackward(date);
			} else {
				this.setTimeToPeriodForward(date)
			}


        }


		private setTimeToPeriodBackward(date: Date) {
			this.workingHours.reverse(function(workingHour: WorkingHour): boolean {
				var contains: number = workingHour.contains(date.getHours(), date.getMinutes(), true);
				switch(contains) {
					//it's before the period
					case -1:
						//continue the iteration
						return true;
						break;
					case 0:
						//break the iteration
						return false;
						break;
					//it's after the period
					case 1:
						//set to the end of the period, and break the iteration
						date.setHours(workingHour.toHour, workingHour.toMinute);
						return false;
						break;
					default:
						return true;

				}
			})
		}

		private setTimeToPeriodForward(date: Date) {
			this.workingHours.each(function(workingHour: WorkingHour): boolean {
				var contains: number = workingHour.contains(date.getHours(), date.getMinutes());
				switch(contains) {
					//it's before the period
					case -1:
						//set to the beginning of the period, and break the iteration
						date.setHours(workingHour.fromHour, workingHour.fromMinute);
						return false;
						break;
					//it's in the period
					case 0:
						//break the iteration
						return false;
						break;
					//it's after the period
					case 1:
						//continue the iteration
						return true;
						break;
					default:
						return true;

				}
			})
		}

    }
}