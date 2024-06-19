import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDto } from '../../services/users-api.service';

@Component({
  selector: 'app-user-row',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-row.component.html',
  styleUrls: ['./user-row.component.css']
})
export class UserRowComponent {
  @Input() public user!: UserDto;
  @Output() public  remove = new EventEmitter<string>();

  public onRemove(): void {
    this.remove.emit(this.user.id);
  }
}
