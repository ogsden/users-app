import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDto } from '../../services/users-api.service';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css']
})
export class UserCardComponent {
  @Input() public user!: UserDto;
  @Output() public remove = new EventEmitter<string>();

  public onRemove(): void {
    this.remove.emit(this.user.id);
  }
}
